
interface AuthenticatedRequest extends FastifyRequest {
  user: User;
}