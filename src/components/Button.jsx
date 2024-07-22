/* eslint-disable react/prop-types */


export default function Button({ children, type, className }) {
  return (
    <button type={type} className={`${className}`}>{children}</button>
  )
}
