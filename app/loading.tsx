import LoadingSpinner from "@/components/LoadingSpinner";


export default function Loading() {
    return (
        <div className="h-screen flex flex-col space-y-8 items-center justify-center">
          <LoadingSpinner/>
        </div>
    );
}