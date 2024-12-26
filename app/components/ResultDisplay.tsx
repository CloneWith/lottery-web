import Button from '@mui/material/Button'
import Fireworks from './Fireworks'
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

export default function ResultDisplay({
                                          winners,
                                          shown,
                                          setShowResult
                                      }: {
    winners: { name: string; prize: string }[],
    shown: boolean,
    setShowResult: (show: boolean) => void
}) {

    return (
        <>
            <div hidden={!shown} className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden">
                <Fireworks/>
            </div>
            <Dialog open={shown}>
                <DialogTitle>中奖结果</DialogTitle>
                <DialogContent>
                    <ul className="space-y-2">
                        {winners.map((winner, index) => (
                            <li key={index} className="flex justify-between items-center border-b pb-2">
                                <span className="font-bold">{winner.name}</span>
                                <span className="text-green-600">{winner.prize}</span>
                            </li>
                        ))}
                    </ul>
                </DialogContent>
                <DialogActions className="mt-4 text-center">
                    <Button variant="contained" startIcon={<ArrowBackIcon/>}
                            onClick={() => setShowResult(false)}>返回抽奖</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

