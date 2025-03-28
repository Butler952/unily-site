const ManageButton = (props) => {
  return (
    <button type="button" className="btn primary small medium w-100 mt-4" onClick={() => props.handleUpdate(event)}>Manage</button>
  )
}

export default ManageButton