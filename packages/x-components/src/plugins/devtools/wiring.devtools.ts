import { CustomInspectorNode, DevtoolsPluginApi, InspectorNodeTag } from '@vue/devtools-api';
import { Dictionary } from '../../utils/index';
import { forEach, reduce } from '../../utils/object';
import { XEvent } from '../../wiring/events.types';
import { filter } from '../../wiring/wires.operators';
import { AnyWire, Wiring } from '../../wiring/wiring.types';
import { XModuleName } from '../../x-modules/x-modules.types';
import { hslToHex, moduleColors } from './utils';

/** The full list of wiring nodes for the inspector. */
const WiringNodes: Partial<Record<XEvent, CustomInspectorNode[]>> = {};
/** Status of the nodes. */
const WiresStatus: Record<string, boolean> = {};

/**
 * Creates tags given a node representing a wire.
 *
 * @param node - The inspector node representing a {@link Wire}.
 * @returns A list of tags for the given node.
 */
function createWireTags({ tags = [], id }: CustomInspectorNode): InspectorNodeTag[] {
  const newTags: InspectorNodeTag[] = [...tags];
  if (!WiresStatus[id]) {
    newTags.push({
      label: 'disabled',
      backgroundColor: hslToHex(0, 88, 30),
      textColor: hslToHex(0, 84, 90)
    });
  }
  return newTags;
}

/**
 * Setups an inspector in Vue's devtools to show the wiring.
 *
 * @param api - Vue's devtools API.
 * @internal
 */
export function setupWiringDevtools(api: DevtoolsPluginApi<void>): void {
  const inspectorId = 'wiring-inspector';
  api.addInspector({
    id: inspectorId,
    label: 'X-Components Wiring'
  });
  api.on.getInspectorTree(payload => {
    if (payload.inspectorId !== inspectorId) {
      return;
    }
    const query = payload.filter.toLowerCase();
    payload.rootNodes = reduce(
      WiringNodes,
      (nodes, event, eventWires) => {
        const wiresNodes =
          /* If there is no active search, or the event name includes the query, we include all the
            available wires. */
          !query || event.toLowerCase().includes(query)
            ? eventWires
            : eventWires.filter(node =>
                node.label.toLowerCase().includes(payload.filter.toLowerCase())
              );
        if (wiresNodes.length) {
          nodes.push({
            id: event,
            label: event,
            children: wiresNodes.map(wireNode => ({
              ...wireNode,
              tags: createWireTags(wireNode)
            }))
          });
        }
        return nodes;
      },
      <CustomInspectorNode[]>[]
    );
  });

  api.on.getInspectorState(payload => {
    if (payload.inspectorId !== inspectorId) {
      return;
    }
    payload.state = {
      status: [
        {
          key: 'enabled',
          value: WiresStatus[payload.nodeId],
          editable: true
        }
      ]
    };
  });

  api.on.editInspectorState(payload => {
    if (payload.inspectorId === inspectorId) {
      WiresStatus[payload.nodeId] = payload.state.value;
      api.sendInspectorTree(inspectorId);
    }
  });
}

/**
 * Sends the module wiring to Vue's devtools inspector.
 *
 * @param module - The module name this wiring belongs too.
 * @param wiring - The wiring to save.
 * @internal
 */
export function sendWiringToDevtools(module: XModuleName, wiring: Partial<Wiring>): void {
  if (process.env.NODE_ENV !== 'production') {
    forEach(wiring, (event, wires: Dictionary<AnyWire>) => {
      const eventWiring = WiringNodes[event] ?? (WiringNodes[event] = []);
      forEach(wires, (wireName, wire) => {
        const id = `${module}-${event}-${wireName}`;
        WiresStatus[id] = true;
        wires[wireName] = filter(wire, () => WiresStatus[id]);
        eventWiring.push({
          id,
          label: wireName,
          tags: [
            {
              label: module,
              ...moduleColors[module]
            }
          ]
        });
      });
    });
  }
}
