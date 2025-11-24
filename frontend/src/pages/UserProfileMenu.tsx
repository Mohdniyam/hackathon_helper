// src/components/UserProfileMenu.tsx
import { useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User2, LogOut } from "lucide-react";

const UserProfileMenu = () => {
  const { profile, logout } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  if (!profile) return null; // not logged in

  const initial =
    profile.name?.[0]?.toUpperCase() ??
    profile.email?.[0]?.toUpperCase() ??
    "?";

  return (
    <>
      {/* Dropdown with avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold">
              {initial}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">
                {profile.name ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {profile.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setOpenProfile(true)}>
            <User2 className="mr-2 h-4 w-4" />
            <span>View profile</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={async () => {
              await logout();
            }}
            className="text-red-600 focus:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile modal */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>
              Your Hackathon Helper account details.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-semibold">
                {initial}
              </div>
              <div>
                <div className="font-medium">
                  {profile.name ?? "No name set"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Role</div>
                <div className="text-sm capitalize">
                  {profile.role ?? "Not set"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">User ID</div>
                <div className="text-xs break-all">{profile.uid}</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserProfileMenu;
