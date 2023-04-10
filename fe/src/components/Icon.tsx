


export default function Icon({src, className, ...props}:icon_props){
  return (
    <span style={{
      backgroundImage: `url(${src})`,
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      display: 'inline-block'
    }}
    className={className}
    {...props}
    >
    </span>
  )
}


type icon_props = {
  className: string,
  src: string,
  title?: string,
}