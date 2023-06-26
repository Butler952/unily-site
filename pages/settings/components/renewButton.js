const RenewButton = (props) => {
  return (
    <button type="button" className={`btn primary small high w-100 mt-4 ${props.className}`} onClick={() => props.handleUpdate(event)}>Renew</button>
  )
}

export default RenewButton