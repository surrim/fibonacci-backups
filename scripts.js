const MS_PER_DAY = 24 * 60 * 60 * 1000;

function addDays(date, days) {
	const result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

function formatDate(date) {
	return date.toLocaleDateString(undefined, {year: "numeric", month: "2-digit", day: "2-digit"});
}

function getBackupsToKeep(initialBackupDate, lastBackupDate, minimumNumberOfPreviousDailyBackups) {
	const numberOfDays = (lastBackupDate - initialBackupDate) / MS_PER_DAY;
	const fibonacciNumbers = [1, 1];
	let fibonacciSum = 0;
	while (true) {
		const nextFibonacciNumber = fibonacciNumbers.at(-2) + fibonacciNumbers.at(-1);
		fibonacciSum += nextFibonacciNumber;
		if (fibonacciSum > numberOfDays - minimumNumberOfPreviousDailyBackups) {
			break;
		}
		fibonacciNumbers.push(nextFibonacciNumber);
	}

	const backupDateOffsets = [0];
	fibonacciNumbers.shift();
	fibonacciNumbers.shift();
	while (fibonacciNumbers.length > 0) {
		fibonacciNumber = fibonacciNumbers.pop();
		backupDateOffsets.push(backupDateOffsets.at(-1) + fibonacciNumber);
	}
	for (let backupOffset = backupDateOffsets.at(-1) + 1; backupOffset <= numberOfDays; ++backupOffset) {
		backupDateOffsets.push(backupOffset);
	}
	return backupDateOffsets.map(backupOffset => addDays(initialBackupDate, backupOffset));
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

