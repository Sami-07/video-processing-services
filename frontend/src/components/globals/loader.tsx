import { Loader, Loader2 } from "lucide-react";

export default function CustomLoader() {
    return <div className="flex justify-center items-center h-screen">
        <Loader className="w-5 h-5 animate-spin" />
    </div>
}