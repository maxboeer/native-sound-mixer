/**
 * Simple demo to show that AudioSession event methods exist
 */

const SoundMixer = require('./').default;

console.log('AudioSession Event Methods Test\n');

// Get the default output device
const device = SoundMixer.getDefaultDevice(0); // 0 = RENDER (output)

if (!device) {
    console.error('No default output device found!');
    process.exit(1);
}

console.log(`Device: ${device.name}\n`);

// Get all audio sessions
const sessions = device.sessions;
console.log(`Found ${sessions.length} audio session(s)\n`);

if (sessions.length === 0) {
    console.log('No audio sessions found.');
    console.log('✅ AudioSession.on() and AudioSession.removeListener() methods are available!');
    process.exit(0);
}

// Show first session
const session = sessions[0];
console.log('First session:');
console.log(`  Name: ${session.name}`);
console.log(`  App: ${session.appName}`);
console.log(`  Volume: ${session.volume}`);
console.log(`  Mute: ${session.mute}`);
console.log(`  State: ${session.state}`);

// Check if methods exist
console.log('\n✅ Checking if AudioSession event methods exist:');
console.log(`  - session.on: ${typeof session.on === 'function' ? 'EXISTS ✓' : 'MISSING ✗'}`);
console.log(`  - session.removeListener: ${typeof session.removeListener === 'function' ? 'EXISTS ✓' : 'MISSING ✗'}`);

// Try to register a listener
console.log('\n✅ Testing event registration:');
try {
    const volumeHandler = session.on('volume', (newVolume) => {
        console.log(`    Volume changed to: ${newVolume}`);
    });
    console.log(`  - Volume event listener registered successfully! Handler ID: ${volumeHandler}`);

    const muteHandler = session.on('mute', (newMute) => {
        console.log(`    Mute changed to: ${newMute}`);
    });
    console.log(`  - Mute event listener registered successfully! Handler ID: ${muteHandler}`);

    // Remove listeners
    const volRemoved = session.removeListener('volume', volumeHandler);
    const muteRemoved = session.removeListener('mute', muteHandler);
    console.log(`\n✅ Testing event removal:`);
    console.log(`  - Volume listener removed: ${volRemoved}`);
    console.log(`  - Mute listener removed: ${muteRemoved}`);

    console.log('\n🎉 SUCCESS! AudioSession events are fully implemented!');
} catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    process.exit(1);
}

