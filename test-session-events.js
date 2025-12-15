/**
 * Test script for AudioSession volume and mute events
 */

const SoundMixer = require('./').default;

console.log('Testing AudioSession Events...\n');

// Get the default output device
const device = SoundMixer.getDefaultDevice(0); // 0 = RENDER (output)

if (!device) {
    console.error('No default output device found!');
    process.exit(1);
}

console.log(`Device: ${device.name}`);
console.log(`Device Type: ${device.type}`);
console.log(`Device Volume: ${device.volume}`);
console.log(`Device Mute: ${device.mute}\n`);

// Get all audio sessions
const sessions = device.sessions;
console.log(`Found ${sessions.length} audio session(s)\n`);

if (sessions.length === 0) {
    console.log('No active audio sessions found. Please play some audio and run this test again.');
    process.exit(0);
}

// Test the first active session
let testSession = null;
for (const session of sessions) {
    if (session.state === 1) { // ACTIVE
        testSession = session;
        break;
    }
}

if (!testSession) {
    console.log('No active audio session found. Please play some audio and run this test again.');
    process.exit(0);
}

console.log('Testing with session:');
console.log(`  Name: ${testSession.name}`);
console.log(`  App: ${testSession.appName}`);
console.log(`  Volume: ${testSession.volume}`);
console.log(`  Mute: ${testSession.mute}`);
console.log(`  State: ${testSession.state}\n`);

// Register event listeners
console.log('Registering event listeners...');

const volumeHandler = testSession.on('volume', (newVolume) => {
    console.log(`  [EVENT] Session volume changed to: ${newVolume}`);
});

const muteHandler = testSession.on('mute', (newMute) => {
    console.log(`  [EVENT] Session mute changed to: ${newMute}`);
});

console.log(`Volume listener registered with handler ID: ${volumeHandler}`);
console.log(`Mute listener registered with handler ID: ${muteHandler}\n`);

// Test volume changes
console.log('Testing volume change...');
const originalVolume = testSession.volume;
testSession.volume = 0.5;
console.log(`Set session volume to 0.5\n`);

setTimeout(() => {
    console.log('Restoring original volume...');
    testSession.volume = originalVolume;
    console.log(`Restored session volume to ${originalVolume}\n`);

    // Test mute changes
    setTimeout(() => {
        console.log('Testing mute change...');
        const originalMute = testSession.mute;
        testSession.mute = !originalMute;
        console.log(`Set session mute to ${!originalMute}\n`);

        setTimeout(() => {
            console.log('Restoring original mute state...');
            testSession.mute = originalMute;
            console.log(`Restored session mute to ${originalMute}\n`);

            // Remove listeners
            setTimeout(() => {
                console.log('Removing event listeners...');
                const volRemoved = testSession.removeListener('volume', volumeHandler);
                const muteRemoved = testSession.removeListener('mute', muteHandler);
                console.log(`Volume listener removed: ${volRemoved}`);
                console.log(`Mute listener removed: ${muteRemoved}\n`);

                console.log('Test completed successfully!');
                process.exit(0);
            }, 1000);
        }, 1000);
    }, 1000);
}, 1000);

// Keep the process running
console.log('Waiting for events... (The process will exit automatically after tests)\n');

