import type { ComponentType, SVGProps } from 'react';
import { FaGithub, FaLinkedin, FaXTwitter, FaGlobe } from 'react-icons/fa6';
import { SiQiita, SiZenn, SiSpeakerdeck } from 'react-icons/si';
import type { SnsPlatform } from '@/schemas/profile';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const REGISTRY: Record<SnsPlatform, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  qiita: SiQiita,
  zenn: SiZenn,
  speakerdeck: SiSpeakerdeck,
  x: FaXTwitter,
  other: FaGlobe,
};

/**
 * SnsLink.platform 値を react-icons コンポーネントに解決する。
 * 未知の値は FaGlobe にフォールバック。
 */
export function snsIconFor(platform: string): IconType {
  return REGISTRY[platform as SnsPlatform] ?? FaGlobe;
}
