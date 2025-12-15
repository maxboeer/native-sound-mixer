import { random } from "lodash"
import "../../dist/@types/sound-mixer.d.ts"
import SoundMixer, { DeviceType, Device, AudioSession } from "../../dist/sound-mixer.cjs"

describe("audio session", () => {

	let device: Device
	let session: AudioSession

	beforeEach(() => {
		const devices = SoundMixer.devices.filter(({ sessions }) => sessions.length > 0)
		device = devices[random(0, devices.length - 1)]
		session = device.sessions[random(0, device.sessions.length - 1)]
	})

	describe("get volume", () => {
		it("should return a clamped volume", () => {
			expect(session.volume).toBeGreaterThanOrEqual(0)
			expect(session.volume).toBeLessThanOrEqual(1.)
		})

		it("should be consistent", () => {
			expect(session.volume).toBe(session.volume)
		})
	})

	describe("set volume", () => {
		let volume: number
		beforeAll(() => {
			volume = session.volume
		})

		it("should not exceed 1.", () => {
			session.volume = 100
			expect(session.volume).toBe(1)
		})

		it("should not be less than 0", () => {
			session.volume = -100
			expect(session.volume).toBe(0)
		})


		afterAll(() => {
			session.volume = volume
		})
	})

	describe("get mute", () => {
		it("should be consitent", () => {
			expect(session.mute).toBe(session.mute)
		})
	})

	describe("set mute", () => {
		let mute: boolean
		beforeAll(() => {
			mute = session.mute
		})

		it("should change the mute flag", () => {
			const mute = Boolean(random(0, 1)).valueOf()
			session.mute = mute
			expect(session.mute).toBe(mute)

			session.mute = !mute
			expect(session.mute).toBe(!mute)
		})


		afterAll(() => {
			session.mute = mute
		})
	})

	describe("events", () => {
		const noop = (): void => {
			// Empty callback for testing
		}

		it("should have on method", () => {
			expect(typeof session.on).toBe("function")
		})

		it("should have removeListener method", () => {
			expect(typeof session.removeListener).toBe("function")
		})

		it("should register volume event listener", () => {
			const handler = session.on("volume", noop)
			expect(typeof handler).toBe("number")
			session.removeListener("volume", handler)
		})

		it("should register mute event listener", () => {
			const handler = session.on("mute", noop)
			expect(typeof handler).toBe("number")
			session.removeListener("mute", handler)
		})

		it("should remove volume event listener", () => {
			const handler = session.on("volume", noop)
			const removed = session.removeListener("volume", handler)
			expect(removed).toBe(true)
		})

		it("should remove mute event listener", () => {
			const handler = session.on("mute", noop)
			const removed = session.removeListener("mute", handler)
			expect(removed).toBe(true)
		})

		it("should trigger volume change event", (done) => {
			const originalVolume = session.volume
			const handler = session.on("volume", (newVolume: number) => {
				expect(typeof newVolume).toBe("number")
				expect(newVolume).toBeGreaterThanOrEqual(0)
				expect(newVolume).toBeLessThanOrEqual(1)
				session.removeListener("volume", handler)
				session.volume = originalVolume
				done()
			})

			// Trigger volume change
			session.volume = originalVolume === 1 ? 0.5 : 1
		})

		it("should trigger mute change event", (done) => {
			const originalMute = session.mute
			const handler = session.on("mute", (newMute: boolean) => {
				expect(typeof newMute).toBe("boolean")
				session.removeListener("mute", handler)
				session.mute = originalMute
				done()
			})

			// Trigger mute change
			session.mute = !originalMute
		})
	})
})
