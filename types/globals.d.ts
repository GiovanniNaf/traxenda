export {}

// Create a type for the roles
export type Roles = 'admin' | 'paciente'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}