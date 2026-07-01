import { useTheme } from "styled-components";

export const LogoIcon = () => {
  const theme = useTheme() as any;

  return (
    <svg width="64" height="64" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Outer Glow */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Glass Fill */}
        <radialGradient id="orbFill" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor={theme.activeMenu} stopOpacity="0.9" />
          <stop offset="70%" stopColor={theme.activeMenu} stopOpacity="0.35" />
          <stop offset="100%" stopColor={theme.primaryBackground} stopOpacity="0.18" />
        </radialGradient>

        {/* Rim */}
        <linearGradient id="rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.primaryBackground} />
          <stop offset="100%" stopColor={theme.activeMenu} />
        </linearGradient>

        {/* Circuit */}
        <linearGradient id="circuit" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.primaryBackground} />
          <stop offset="100%" stopColor={theme.activeMenu} />
        </linearGradient>
      </defs>

      {/* Glow */}
      <circle cx="48" cy="48" r="39" fill={theme.activeMenu} opacity=".25" filter="url(#glow)" />

      {/* Orb */}
      <circle cx="48" cy="48" r="36" fill="url(#orbFill)" stroke="url(#rim)" strokeWidth="2" />

      {/* Highlight */}
      <ellipse cx="36" cy="26" rx="13" ry="7" fill={theme.primaryText} opacity=".1" />

      {/* Core */}
      <circle cx="48" cy="48" r="6" fill={theme.activeMenu} filter="url(#glow)" />

      {/* Horizontal */}
      <path d="M48 48H26M48 48H70" stroke="url(#circuit)" strokeWidth="2" strokeLinecap="round" />

      {/* Vertical */}
      <path d="M48 48V26M48 48V70" stroke="url(#circuit)" strokeWidth="2" strokeLinecap="round" />

      {/* Diagonal */}
      <path d="M48 48L30 30" stroke="url(#circuit)" strokeWidth="2" strokeLinecap="round" />

      <path d="M48 48L66 30" stroke="url(#circuit)" strokeWidth="2" strokeLinecap="round" />

      <path d="M48 48L30 66" stroke="url(#circuit)" strokeWidth="2" strokeLinecap="round" />

      <path d="M48 48L66 66" stroke="url(#circuit)" strokeWidth="2" strokeLinecap="round" />

      {/* Extra Circuit Lines */}
      <path d="M30 30H24V22" stroke="url(#circuit)" strokeWidth="1.6" strokeLinecap="round" />

      <path d="M66 30H74V20" stroke="url(#circuit)" strokeWidth="1.6" strokeLinecap="round" />

      <path d="M30 66H20V74" stroke="url(#circuit)" strokeWidth="1.6" strokeLinecap="round" />

      <path d="M66 66H76V74" stroke="url(#circuit)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Circuit Nodes */}
      {[
        [24, 22],
        [74, 20],
        [20, 74],
        [76, 74],
        [26, 48],
        [70, 48],
        [48, 26],
        [48, 70],
        [30, 30],
        [66, 30],
        [30, 66],
        [66, 66],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={theme.primaryBackground} filter="url(#glow)" />
      ))}
    </svg>
  );
};

export const Logo = () => (
  <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.2363 8.68945C26.1247 8.68945 23.6021 11.212 23.6021 14.3236V33.1468V44.3727V59.1853C23.6021 60.2225 22.7613 61.0634 21.7241 61.0634C20.6868 61.0634 19.846 60.2225 19.846 59.1853V33.1468H19.8453V29.6644C19.8453 26.5527 17.3228 24.0302 14.2111 24.0302C11.0994 24.0302 8.57693 26.5527 8.57693 29.6644V35.2801H2.31759C1.41947 35.2801 0.691406 36.0082 0.691406 36.9063C0.691406 37.8044 1.41948 38.5325 2.31759 38.5325H11.0834C11.7748 38.5325 12.3354 37.9719 12.3354 37.2804V35.2801H12.3331V29.6644C12.3331 28.6272 13.1739 27.7863 14.2111 27.7863C15.2483 27.7863 16.0892 28.6272 16.0892 29.6644V35.3139H16.0899V59.1853C16.0899 62.297 18.6124 64.8195 21.7241 64.8195C24.8358 64.8195 27.3583 62.297 27.3583 59.1853V44.3727V33.1468V14.3236C27.3583 13.2864 28.1991 12.4456 29.2363 12.4456C30.2736 12.4456 31.1144 13.2864 31.1144 14.3236V44.3727L31.1144 46.0962C31.1144 49.2079 33.6369 51.7304 36.7486 51.7304C39.8603 51.7304 42.3828 49.2079 42.3828 46.0962V44.165V22.1962V20.265C42.3828 19.2277 43.2236 18.3869 44.2608 18.3869C45.2981 18.3869 46.1389 19.2277 46.1389 20.265V37.5671H46.138V66.6765C46.138 69.7882 48.6605 72.3107 51.7722 72.3107C54.8839 72.3107 57.4064 69.7882 57.4064 66.6765V44.3958V37.5671V15.2864C57.4064 14.2492 58.2472 13.4083 59.2844 13.4083C60.3217 13.4083 61.1625 14.2492 61.1625 15.2864V37.0302H61.16V51.7569C61.16 54.8686 63.6826 57.3911 66.7942 57.3911C69.9059 57.3911 72.4284 54.8686 72.4284 51.7569V38.6566H78.6864C79.5845 38.6566 80.3126 37.9285 80.3126 37.0304C80.3126 36.1323 79.5845 35.4042 78.6864 35.4042H69.916C69.2245 35.4042 68.6639 35.9648 68.6639 36.6563V38.6566H68.6723V51.7569C68.6723 52.7942 67.8315 53.635 66.7942 53.635C65.757 53.635 64.9162 52.7942 64.9162 51.7569V44.3958H64.9186V15.2864C64.9186 12.1747 62.3961 9.65221 59.2844 9.65221C56.1728 9.65221 53.6503 12.1747 53.6503 15.2864V37.5671V44.3958V66.6765C53.6503 67.7137 52.8094 68.5546 51.7722 68.5546C50.735 68.5546 49.8941 67.7137 49.8941 66.6765V44.165H49.895V20.265C49.895 17.1533 47.3725 14.6308 44.2608 14.6308C41.1492 14.6308 38.6267 17.1533 38.6267 20.265V22.1962V44.165V46.0962C38.6267 47.1335 37.7858 47.9743 36.7486 47.9743C35.7114 47.9743 34.8705 47.1335 34.8705 46.0962V22.1962L34.8705 14.3236C34.8705 11.212 32.348 8.68945 29.2363 8.68945Z"
      fill="url(#paint0_linear_1720_6122)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1720_6122"
        x1="35.6345"
        y1="-10.6852"
        x2="91.7113"
        y2="34.9535"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.00769832" stopColor="#0865A7" />
        <stop offset="0.00779832" stopColor="#106CB6" />
        <stop offset="1" stopColor="#098DE2" />
      </linearGradient>
    </defs>
  </svg>
);
