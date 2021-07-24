const ManageButton = (props) => {
  return (
    <button type="button" className="btn primary medium w-100 mt-5" onClick={() => props.handleUpdate(event)}>Manage</button>
  )
}

export default ManageButton