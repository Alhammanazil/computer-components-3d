import {
  motherboard, processor, ram, graphicsCard, soundCard, networkCard, fan, powerSupply,
} from './core.js';
import {
  hardDrive, ssd, opticalDrive, cdDvd, floppyDisk, flashDrive,
} from './storage.js';
import {
  monitor, keyboard, mouse, speaker, headset, webcam, printer, joystick, microphone,
} from './peripherals.js';
import {
  vga, hdmi, displayPort, usbA, usbB, usbC, microUsb, rj45, audioJack,
} from './ports.js';

/** id komponen -> fungsi pembuat model 3D ({ group, parts, view }). */
export const builders = {
  motherboard,
  processor,
  ram,
  'graphics-card': graphicsCard,
  'sound-card': soundCard,
  'network-card': networkCard,
  fan,
  psu: powerSupply,
  'hard-drive': hardDrive,
  ssd,
  'optical-drive': opticalDrive,
  'cd-dvd': cdDvd,
  floppy: floppyDisk,
  'flash-drive': flashDrive,
  monitor,
  keyboard,
  mouse,
  speaker,
  headset,
  webcam,
  printer,
  joystick,
  microphone,
  'port-vga': vga,
  'port-hdmi': hdmi,
  'port-displayport': displayPort,
  'port-usb-a': usbA,
  'port-usb-b': usbB,
  'port-usb-c': usbC,
  'port-micro-usb': microUsb,
  'port-rj45': rj45,
  'port-audio': audioJack,
};
