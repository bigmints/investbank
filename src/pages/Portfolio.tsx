
import { TopBar } from '../components/ui/TopBar';

export default function Portfolio() {
    return (
        <div className="min-h-full">
            <TopBar title="Portfolio" />
            <div className="p-4 flex flex-col items-center justify-center h-[60vh] text-gray-400">
                <h2 className="text-xl font-medium">Your Assets</h2>
                <p>Coming soon...</p>
            </div>
        </div>
    );
}
