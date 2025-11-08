export default function Loader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-muted rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-primary border-r-primary rounded-full animate-spin" />
      </div>
    </div>
  );
}
