import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { appName, gitConfig, npmPackage } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2 font-medium">
          <Image
            src="/brand/masumi-mark.png"
            alt="Masumi"
            width={24}
            height={24}
            className="rounded-full"
            priority
          />
          <span>{appName}</span>
        </div>
      ),
      url: '/',
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    links: [
      {
        text: 'npm',
        url: `https://www.npmjs.com/package/${npmPackage}`,
        external: true,
      },
    ],
  };
}
