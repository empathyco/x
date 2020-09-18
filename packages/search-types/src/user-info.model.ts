/**
 * The representation of the user.
 *
 * @public
 */
export interface UserInfo {
  /** A unique token that represents the user over a long period of time. */
  user: string;
  /** A unique token that represents a search session. */
  session: string;
  /** Whether the user is new or recurrent. */
  userType: string;
}
