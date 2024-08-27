import { Badge, BadgeProps, Tooltip } from '@mantine/core';
import { NextLink } from '@mantine/next';

export function IconBadge({ icon, children, tooltip, href, cssProps, ...props }: IconBadgeProps) {
  const styleObj = {
    leftSection: { marginRight: 4 },
    root: {
      paddingLeft: 3,
      paddingRight: 5,
      cursor: 'pointer',
      fontWeight: 500,
      // background: 'transparent',
      color: '#fff',
      background: 'var(--color-secondary-bg)',
      ...cssProps,
    },
  };
  const badge = href ? (
    <Badge
      component={NextLink}
      href={href}
      styles={styleObj}
      radius="sm"
      color="gray"
      leftSection={icon}
      {...props}
    >
      {children}
    </Badge>
  ) : (
    <Badge styles={styleObj} radius="sm" color="gray" leftSection={icon} {...props}>
      {children}
    </Badge>
  );

  if (!tooltip) return badge;

  return (
    <Tooltip label={tooltip} position="top" color="dark" withArrow>
      {badge}
    </Tooltip>
  );
}

export type IconBadgeProps = {
  icon: React.ReactNode;
  cssProps?: object;
  tooltip?: React.ReactNode;
  onClick?: React.MouseEventHandler<any> | undefined; //eslint-disable-line
  href?: string;
} & Omit<BadgeProps, 'leftSection'>;
