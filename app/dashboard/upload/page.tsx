import UploadForm from "@/components/dashboard/upload/upload-form";

export default function DashboardUpload() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Upload Book</h1>
        <p className="text-muted-foreground mt-1">
          Add a new book to your library
        </p>
      </div>
      <UploadForm />
    </div>
  );
}
