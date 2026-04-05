import type { AuthFlow } from './AuthFlow';
import { BasicAuthExecutor } from './executor/BasicAuthExecutor';

const flows: AuthFlow[] = [
  {
    id: 'basic-auth',
    label: 'Basic Auth',
    description:
      'HTTP Basic authentication sends a username and password with each request using the Authorization header. It is simple to implement and widely supported across clients and servers. Because credentials are repeatedly transmitted, it should only be used over HTTPS.',
    infoLink: 'https://www.rfc-editor.org/rfc/rfc7617',
    executorFactory: (render) => new BasicAuthExecutor(render),
  },
  {
    id: 'jwt',
    label: 'JWT',
    description:
      'JSON Web Tokens are compact, signed tokens that carry claims about a user or session. They are commonly used for stateless authentication because servers can validate signatures without storing per-session state. Token lifetime, signing algorithm choice, and secure storage all strongly affect security.',
    infoLink: 'https://www.rfc-editor.org/rfc/rfc7519',
  },
  {
    id: 'totp-2fa',
    label: '2FA (TOTP)',
    description:
      'Time-based one-time passwords add a second authentication factor beyond a password. A shared secret and current time are used to generate short-lived numeric codes in an authenticator app. This approach significantly improves account security, though phishing-resistant methods can provide stronger protection.',
    infoLink: 'https://www.rfc-editor.org/rfc/rfc6238',
  },
  {
    id: 'oidc',
    label: 'OIDC',
    description:
      'OpenID Connect is an identity layer built on top of OAuth 2.0. It standardizes authentication flows and defines tokens like the ID Token for conveying user identity claims. OIDC is commonly used for single sign-on and delegation to trusted identity providers.',
    infoLink: 'https://openid.net/specs/openid-connect-core-1_0.html',
  },
  {
    id: 'webauthn',
    label: 'WebAuthn',
    description:
      'WebAuthn enables strong, phishing-resistant authentication using public-key cryptography. Credentials are created and stored by authenticators such as security keys, platform biometrics, or passkeys. Since no shared secret password is sent to the server, it reduces credential theft and replay risks.',
    infoLink: 'https://www.w3.org/TR/webauthn-3/',
  },
];

export { flows };
