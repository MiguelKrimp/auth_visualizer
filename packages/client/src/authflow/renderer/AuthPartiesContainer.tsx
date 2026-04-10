import type { JSX } from 'react';

/**
 * Container for 2 parties involved in the authentication flow. Every communication window between different parties is rendered inside one container.
 * This is needed because some elements are positioned absolutely in relation to the container, so we need to group them together.
 *
 * E.g. for a communication between the client, our server and some authentication provider, we would render:
 * - one container for the client and our server
 * - one container for our server and the authentication provider
 * - and maybe another after that for our client and the server again
 */
export class AuthPartiesContainer {
  private elements: JSX.Element[] = [];
  // enough randomness for our purposes...
  private id = (Math.random() * 16 ** 16).toString(16);

  addElements(elements: JSX.Element[]) {
    this.elements.push(...elements);
  }

  render(): JSX.Element {
    return (
      <div key={this.id} style={{ position: 'relative' }}>
        {this.elements}
      </div>
    );
  }
}
