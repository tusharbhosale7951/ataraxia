import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BreakReminderProps {
  open: boolean
  onClose: () => void
  onStartBreathing: () => void
  onSnooze: () => void
}

export const BreakReminder = ({ open, onClose, onStartBreathing, onSnooze }: BreakReminderProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A2A1F] text-white border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">Time for a break ❤️</DialogTitle>
          <DialogDescription className="text-gray-300">
            You've been using Ataraxia for 25 minutes. How about a quick breathing exercise?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={onStartBreathing} className="bg-sage-600 hover:bg-sage-700">
            Start 4-7-8 Breathing
          </Button>
          <Button variant="outline" onClick={onSnooze} className="border-white/20 text-white hover:bg-white/10">
            Remind me in 5 min
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}