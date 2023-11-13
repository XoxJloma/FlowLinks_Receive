import * as tmp from 'tmp';
import * as fs from 'node:fs';

async function jobArrived(s: Switch, flowElement: FlowElement, job: Job) {
	await job.sendToSingle();
}
// При старте потока создаем временный каталог и подписываемся на канал
async function flowStartTriggered(s: Switch, flowElement: FlowElement) {
	const tempDir = tmp.dirSync({ prefix: 'FlowLinks', unsafeCleanup: true });
	await s.setGlobalData(Scope.FlowElement, 'tempDest', tempDir.name);
	const Channel = (await flowElement.getPropertyStringValue('Channel')) as string;
	try {
		await flowElement.subscribeToChannel(Channel, tempDir.name);
		await flowElement.log(LogLevel.Warning, "Subscribed to '%1' channel in folder '%2'", [Channel, tempDir.name]);
	} catch (error) {
		await flowElement.log(LogLevel.Error, `Channel ${Channel} already subscribed to`);
	}
}
// При остановке потока удаляем временный каталог
async function flowStopTriggered(s: Switch, flowElement: FlowElement) {
	const tempDest = await s.getGlobalData(Scope.FlowElement, 'tempDest');
	try {
		fs.rmdirSync(tempDest);
	} catch (error) {
		await flowElement.log(LogLevel.Error, `Failed to delete the directory created for the channel: ${tempDest}`);
	}
}
