interface AuthenticatedRequest<T extends IUser> extends FastifyRequest {
  user: T;
}
