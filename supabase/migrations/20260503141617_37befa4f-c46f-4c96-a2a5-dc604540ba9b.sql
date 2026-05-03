
REVOKE EXECUTE ON FUNCTION public.is_engagement_member(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_engagement_on_accept() FROM PUBLIC, anon, authenticated;
