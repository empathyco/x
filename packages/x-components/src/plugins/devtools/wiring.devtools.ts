import { Dictionary, forEach, reduce } from '@empathyco/x-utils';
import { CustomInspectorNode, DevtoolsPluginApi, InspectorNodeTag } from '@vue/devtools-api';
import { XEvent } from '../../wiring/events.types';
import { filter } from '../../wiring/wires.operators';
import { AnyWire, Wiring } from '../../wiring/wiring.types';
import { XModuleName } from '../../x-modules/x-modules.types';
import { hslToHex, moduleColors } from './colors.utils';

/** The full list of wiring nodes for the inspector. */
const wiringNodes: Partial<Record<XEvent, CustomInspectorNode[]>> = {};
/**
 * Record of the wires enabled/disabled status.
 */
const wiresStatus: Record<string, boolean> = {};

/**
 * Creates tags given a node representing a wire.
 *
 * @param node - The inspector node representing a {@link Wire}.
 * @returns A list of tags for the given node.
 */
function createWireTags({ tags = [], id }: CustomInspectorNode): InspectorNodeTag[] {
  const newTags: InspectorNodeTag[] = [...tags];
  if (!wiresStatus[id]) {
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
export function setupWiringDevtools(api: DevtoolsPluginApi<Dictionary<unknown>>): void {
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
      wiringNodes,
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
          value: wiresStatus[payload.nodeId],
          editable: true
        }
      ]
    };
  });

  api.on.editInspectorState(payload => {
    if (payload.inspectorId === inspectorId) {
      wiresStatus[payload.nodeId] = payload.state.value;
      api.sendInspectorTree(inspectorId);
    }
  });
}

/**
 * Sends the module wiring to Vue's devtools inspector. Additionally, it modifies each wire, adding
 * a filter function to let it be enabled/disabled from the devtools.
 *
 * @param module - The module name this wiring belongs too.
 * @param wiring - The wiring to save.
 * @internal
 */
export function sendWiringToDevtools(module: XModuleName, wiring: Partial<Wiring>): void {
  if (process.env.NODE_ENV !== 'production') {
    forEach(wiring, (event, wires: Dictionary<AnyWire>) => {
      const eventWiring = wiringNodes[event] ?? (wiringNodes[event] = []);
      forEach(wires, (wireName, wire) => {
        const id = `${module}-${event}-${wireName}`;
        wiresStatus[id] = true;
        wires[wireName] = filter(wire, () => wiresStatus[id]);
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
