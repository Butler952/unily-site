const UpgradeButton = (props) => {
  return (
    <button type="button" className="btn primary small high w-100 mt-4" onClick={() => props.handleUpgrade(event)}>Upgrade</button>
  )
}

export default UpgradeButton