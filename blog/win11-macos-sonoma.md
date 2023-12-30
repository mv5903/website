## 12/11/2023: Running Windows 11 and macOS Sonoma simultaneously with Proxmox PVE

### The original idea
Sometime in November of 2023, I decided that I wanted to have an easier way to access the macOS ecosystem without needing to use my Macbook Pro. I already have a Macbook Pro, iPhone, iPad, Apple Watch, and Airpods, so I didn't think that purchasing another Apple Device was worth it. 
<br><br>
After some thinking, I realized that I could technically run macOS Sonoma in a virtual machine. The problem is, my experience attempting to run macOS in a virtual machine was a bit of a mess and the performance is not that great, so I decided to look for other options. Sure I could use VMWare or VirtualBox, but I don't want to have to boot into a separate OS just to use macOS. I want to be able to use it alongside Windows 11, and I want to be able to use it in a way that is seamless and easy to use.
<br><br>
As I had just recently finished creating my Homelab with Proxmox PVE, I realized that I could use this same ideology and apply it to my personal gaming rig. I already had 64GB of RAM, 2 2TB NVMe SSDs, and a 20-thread processor (i7-12700F), so I had plenty of resources to spare. I decided to give it a shot and see if I could get it to work and be relatively practical in my day-to-day use.
<br><br>
So, I settled on Proxmox PVE as my hypervisor of choice. I had already been using it for a few months and was very familiar with it at this point, so I decided to go with it. Allocate some RAM and CPU cores and pass through a GPU to each VM and I should be good to go, right? Well, not exactly.

### Installing Proxmox
I didn't want to remove my old installation of Windows 11 in case I needed to go back to it, so I installed Proxmox PVE on my second SSD. I downloaded the ISO, created the installation media with Balena Etcher, and then booted my PC off of that USB. But there was a minor issue. In the version of the Proxmox installer that I was using, it seems that using a processor without integrated graphics (Intel F model in my situation) and using only an NVIDIA gpu for display output caused the installer to freeze while setting up PCIe devices. Odd, but thankfully I had a spare AMD RX 570 lying around, and I was able to use that to get through the installer. 

### Installing Windows 11 - The easy part
After installing Proxmox, I created a new Virtual Machine and installed Windows 11. I needed to upload the Windows 11 ISO I created from the Media Creation Tool on another Windows 11 computer, and boot off of that. However, I noticed that the Windows Installer was not detecting my virtual disk. To fix that, I needed to install the virtio drivers, which are availble from the Proxmox website. Then, as soon as I installed the correct driver, I was able to see my virtual disk and install Windows 11 on it. 

Once the Windows setup screen appeared a few minutes later, I proceeded through it. I was then asked to sign in with a Microsoft Account and connect to the internet. Even if I had the network drivers installed, I personally always prefer to continue through the setup without connecting to the internet. I prefer this since it makes setup much faster, and I can get to the desktop faster; I can always connect to the internet later onece I am ready. To bypass this restriction in Windows 11, I pressed `Shift + F10` on my keyboard to open the Command Prompt, typed `OOBE\BYPASSNRO`, and then the setup screen came back again after a few more seconds. This allowed me to use a local account and skip the internet connection step.

Once at the desktop, I checked Task Manager to ensure that everything was displayed at expected. I noticed that yes, the cores I assigned were there, the memory was there, and the disk was there. To save some time later, I was able to pass through my other NVMe SSD and grab my Steam Games directly from it, saving me time from needed to download them all again. So far, everything is working great, so let's proceed to the next step.

### Passing through the GPU - The slightly more challenging part
I have an NVIDIA RTX 3080 Founder's Edition card, and I wanted to pass this through to the Windows 11 VM so that I can play some games. I followed this guide to pass through my GPU, which worked perfectly. It involved blacklisting them through Proxmox, making sure IOMMU was set up in my host BIOS, and updating some configuration files. I then added the GPU as a new PCI device in the Hardware tab of the Virtual Machine, and then I was able to boot into Windows 11 with my GPU passed through. I then installed the NVIDIA drivers, and everything was working great. I was able to play games, and I was getting great performance. Maybe around a 3-5% loss, but not enough to where it really mattered to me.

### Setting up the macOS VM - The challenging part
Setting up a virtual machine on any platform is notoriously difficult thanks to Apple's strict licensing and hardware requirements. I used the OpenCore route, which allowed me to install and run the virtual machine without any issues, however passing through my AMD RX 570 was extremtly hard. It took me a few hours just for this part, because it involved me needing to try different options in the Hardware tab of the macOS VM. 
<br><br>
The experience, at first, was great. The `About this Mac` tab correctly showed the cores, memory, and spoofed hardware serial number, as well as the graphics card. I was able to sign into my Apple ID and use iMessage and iCloud with ease. I also installed Synergy, which allowed me to use the keyboard and mouse that was passed into my Windows 11 VM like my macOS VM was a second monitor. This was great, and I was able to use macOS Sonoma with ease.
<br><br>

### The final decision: It's not worth it.
There are a lot of issues I encountered in the week that I had this setup full functional:
- When waking up Windows from the monitors being shut off, one of my two monitors would not turn on. I had to unplug and plug in the monitor again to the graphcis card, and the problem would be fixed. Ok, but annoying.
- There was some minor graphical glitches happening with my RX 570. I would see random lines appearing and flashes every few minutes, which was annoying. Not a dealbreaker, but annoying.
- If those two weren't annoying enough, macOS Sonoma can't go to sleep. If this happens, it would wake up and operate fine for a while, but then it would freeze and I would need to force shutdown the VM. This was a dealbreaker for me, as I don't want to have to worry about this happening every time I leave my computer for a few minutes.
<br><br>
So ultimately, I decided that although I learned so much and got so far with this, it's not worth it. I really need something that works all the time with no problems, not something that I can play around with here and there.

