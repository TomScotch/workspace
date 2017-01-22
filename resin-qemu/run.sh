qemu-system-x86_64 -drive file=resin-image-qemux86-64.img,media=disk,cache=none,format=raw -net nic,model=virtio -net user -m 512 -nographic -machine type=pc,accel=kvm -smp 4 -cpu host
