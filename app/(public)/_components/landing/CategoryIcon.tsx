import {
  IconBriefcase,
  IconCamera,
  IconChartBar,
  IconCode,
  IconCoin,
  IconHeartbeat,
  IconLayoutGrid,
  IconPalette,
  IconSchool,
  IconServer,
  IconSpeakerphone,
  IconUser,
  type Icon,
} from "@tabler/icons-react";

/**
 * Icon lookup for the canonical category registry.
 *
 * `COURSE_CATEGORIES` stores the icon as a plain name so the taxonomy stays
 * serialisable; this map turns that name into a component. The fallback keeps
 * a new category from ever rendering a broken tile.
 */
const CATEGORY_ICONS: Record<string, Icon> = {
  code: IconCode,
  server: IconServer,
  chart: IconChartBar,
  palette: IconPalette,
  briefcase: IconBriefcase,
  megaphone: IconSpeakerphone,
  coin: IconCoin,
  heart: IconHeartbeat,
  user: IconUser,
  layout: IconLayoutGrid,
  school: IconSchool,
  camera: IconCamera,
};

/** Renders the icon that belongs to a category icon name. */
export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = CATEGORY_ICONS[name] ?? IconCode;

  return <IconComponent className={className} />;
}
