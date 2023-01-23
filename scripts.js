function formatDate(date) {
	return date.toLocaleDateString(undefined, {day: "2-digit", month: "2-digit", year: "numeric"});
}

function getOffsets(numberOfDays) {
	const fibonacciNumbers = [1, 1];
	for (let fibonacciNumbersSum = 2; fibonacciNumbersSum <= numberOfDays; fibonacciNumbersSum += fibonacciNumbers.at(-1)) {
		fibonacciNumbers.push(fibonacciNumbers.at(-2) + fibonacciNumbers.at(-1));
	}
	debugger;
	const offsets = [];
	while (true) {
		const lastFibonacciNumber = fibonacciNumbers.pop();
		newOffset = lastFibonacciNumber + (offsets.at(-1) ?? 0);
		if (newOffset >= numberOfDays) {
			break;
		}
		offsets.push(newOffset);
	}
	return offsets;
}

function getBackupsToKeepRelative(numberOfDays, minimumNumberOfPreviousDailyBackups) {
	const offsets = [0];
	while (true) {
		const newOffsets = getOffsets(numberOfDays - offsets.at(-1)).map(offset => offsets.at(-1) + offset);
		if (newOffsets.length == 0) {
			break;
		}
		offsets.push(...newOffsets);
		console.info(offsets);
	}
	
	return offsets;
}

function getBackupsToKeep(initialBackupDate, lastBackupDate, minimumNumberOfPreviousDailyBackups) {
	const MS_PER_DAY = 24 * 60 * 60 * 1000;
	const addDays = (date, days) => {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	};

	const numberOfDays = (lastBackupDate - initialBackupDate) / MS_PER_DAY;
	return getBackupsToKeepRelative(numberOfDays).map(offset => addDays(initialBackupDate, offset));
}

function do_calc() {
	const initialBackupDate = document.getElementById("initialBackupDate").valueAsDate;
	const lastBackupDate = document.getElementById("lastBackupDate").valueAsDate;
	const minimumNumberOfPreviousDailyBackups = document.getElementById("minimumNumberOfPreviousDailyBackups").valueAsNumber;

	const backupsToKeep = getBackupsToKeep(
		initialBackupDate,
		lastBackupDate,
		minimumNumberOfPreviousDailyBackups
	);

	document.getElementById("title").innerHTML = "Backups to keep (" + backupsToKeep.length + ")";
	document.getElementById("result").innerHTML = backupsToKeep.map(formatDate).join("\n");
}

document.addEventListener('DOMContentLoaded', do_calc);

