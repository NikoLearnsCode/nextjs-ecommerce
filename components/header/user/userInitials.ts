export function computeUserInitials(
  name: string | null | undefined,
  email: string | null | undefined,
): string {
  if (name) {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
    return nameParts[0].charAt(0).toUpperCase();
  }
  return email?.charAt(0).toUpperCase() ?? 'U';
}
