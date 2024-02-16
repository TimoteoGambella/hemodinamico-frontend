
export default function CloseSession({ width, height, style }: IconAssetsProps) {
  if (typeof width === 'number') width = `${width}px`
  if (typeof height === 'number') height = `${height}px`
  if (!style?.color) style = { ...style, color: '#ffffffb5' }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height || '20px'}
      width={width || '20px'}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={style}
    >
      <rect id="view-box" width="24" height="24" fill="none" />
      <path
        id="Shape"
        d="M2.95,17.5A2.853,2.853,0,0,1,0,14.75v-12A2.854,2.854,0,0,1,2.95,0h8.8a.75.75,0,0,1,0,1.5H2.95A1.362,1.362,0,0,0,1.5,2.75v12A1.363,1.363,0,0,0,2.95,16h8.8a.75.75,0,0,1,0,1.5Zm9.269-4.219a.751.751,0,0,1,0-1.061L14.939,9.5H5.75a.75.75,0,0,1,0-1.5h9.19L12.219,5.28A.75.75,0,1,1,13.28,4.22l4,4a.749.749,0,0,1,0,1.06l-4,4a.751.751,0,0,1-1.061,0Z"
        transform="translate(3.25 3.25)"
        fill="#currentColor"
      />
    </svg>
  )
}
