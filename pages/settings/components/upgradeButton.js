const UpgradeButton = (props) => {
  return (
    <button type="button" className="btn primary high w-100 mt-5" onClick={() => props.handleUpgrade(event)}>Upgrade</button>
  )
}

export default UpgradeButton