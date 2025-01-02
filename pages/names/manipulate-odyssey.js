import odysseyArray from "./odyssey/odyssey-array-7.json";
import iliadArray from "./iliad/names.json";

const Names = () => {

	const manipulateList = () => {
		// Create a copy of the odyssey array to modify
		const result = odysseyArray.map(item => ({...item}));
		
		// Create a map of Iliad names to their allegiances for quick lookup
		const iliadGenderMap = iliadArray.reduce((map, item) => {
			if (item.name && item.gender) {
				map[item.name.toLowerCase()] = item.gender;
			}
			return map;
		}, {});

		result.forEach(item => {
			const description = (item.description || []).join(' ').toLowerCase();
			
			// First try to copy allegiance from Iliad array
			const iliadGender = iliadGenderMap[item.name.toLowerCase()];
			if (iliadGender) {
				item.gender = iliadGender;
			}
		});

		console.log(result);
		return result;
	};

	const compareEpics = () => {
		// Convert names to lowercase for case-insensitive comparison
		const odysseyNames = odysseyArray.map(item => item.name.toLowerCase());
		const iliadNames = iliadArray.map(item => item.name.toLowerCase());

		// Find names that appear in both arrays
		const commonNames = odysseyNames.filter(name => iliadNames.includes(name));

		// Find unique names in each array
		const uniqueIliadNames = iliadNames.filter(name => !odysseyNames.includes(name));
		const uniqueOdysseyNames = odysseyNames.filter(name => !iliadNames.includes(name));

		const comparison = {
			totalIliad: iliadNames.length,
			totalOdyssey: odysseyNames.length,
			commonNamesCount: commonNames.length,
			uniqueIliadCount: uniqueIliadNames.length,
			uniqueOdysseyCount: uniqueOdysseyNames.length,
		};

    console.log(comparison)
		return comparison;
	};

	const mergeEpicDescriptions = () => {
		// Create a deep copy of iliadArray as our base
		const mergedArray = JSON.parse(JSON.stringify(iliadArray));
		
		// Create a map of existing Iliad names for quick lookup
		const iliadNameMap = new Map(
			mergedArray.map(item => [item.name.toLowerCase(), item])
		);
		
		// Process Odyssey entries
		odysseyArray.forEach(odysseyItem => {
			const lowercaseName = odysseyItem.name.toLowerCase();
			const iliadEntry = iliadNameMap.get(lowercaseName);
			
			if (iliadEntry) {
				// Merge descriptions for matching names
				const odysseyDesc = odysseyItem.description || [];
				iliadEntry.description = [
					...(iliadEntry.description || []),
					...odysseyDesc
				];
			} else {
				// Add new Odyssey entries that don't exist in Iliad
				mergedArray.push({...odysseyItem});
			}
		});
		
		console.log(mergedArray);
		return mergedArray;
	};

	return (
		<div>
			<button onClick={manipulateList}>Click to log results</button>
			<button onClick={compareEpics}>Compare Epics</button>
			<button onClick={mergeEpicDescriptions}>Merge Descriptions</button>
		</div>
	);
};

export default Names;
