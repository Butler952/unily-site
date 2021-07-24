const RenewButton = (props) => {
  return (
    <button type="button" className={`btn primary high w-100 mt-5 ${props.className}`} onClick={() => props.handleUpdate(event)}>Renew</button>
  )
}

export default RenewButton