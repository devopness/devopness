import { dotSpinner } from 'ldrs'

dotSpinner.register()

const CircleBubble = ({ color, size }: { color: string; size: number }) => (
  <l-dot-spinner
    size={size}
    speed="0.9"
    color={color}
  ></l-dot-spinner>
)

export { CircleBubble }
