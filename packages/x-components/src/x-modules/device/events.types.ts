/**
 * Dictionary of the events of {@link DeviceXModule}, where each key is the event name, and the
 * value is the event payload type or `void` if it has no payload.
 *
 * @public
 */
export interface DeviceXEvents {
  /**
   * The device that has been provided.
   * * Payload: The name of the device, or `null` if the detection failed.
   */
  DeviceProvided: string | null;
}
