"use client";

import { useState } from "react";
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Mail,
  Crown,
  Code,
  Palette,
} from "lucide-react";

const roles = [
  { id: "lead", label: "Team Lead", icon: Crown },
  { id: "dev", label: "Developer", icon: Code },
  { id: "designer", label: "Designer", icon: Palette },
];

export default function Team() {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "You",
      role: "lead",
      email: "you@example.com",
      avatar: "👤",
    },
    {
      id: 2,
      name: "Alex Chen",
      role: "dev",
      email: "alex@example.com",
      avatar: "👨‍💻",
    },
    {
      id: 3,
      name: "Jordan Smith",
      role: "designer",
      email: "jordan@example.com",
      avatar: "🎨",
    },
  ]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("dev");
  const [copied, setCopied] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const handleInvite = () => {
    if (inviteEmail) {
      setMembers([
        ...members,
        {
          id: Date.now(),
          name: inviteEmail,
          role: selectedRole,
          email: inviteEmail,
          avatar: "📧",
        },
      ]);
      setInviteEmail("");
      setShowInviteForm(false);
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}?invite=team123`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRoleIcon = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.icon : Users;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Organize your team members and roles
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Invite Form */}
      {showInviteForm && (
        <div className="bg-muted/30 border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">
            Invite Team Member
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="member@example.com"
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleInvite}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                        selectedRole === role.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => setShowInviteForm(false)}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invite Link */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-3">
          Share Invite Link
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}?invite=team123`}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-muted-foreground"
          />
          <button
            onClick={copyInviteLink}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Team Members ({members.length})
        </h2>
        {members.map((member) => {
          const RoleIcon = getRoleIcon(member.role);
          return (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg hover:border-muted-foreground/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-lg">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <RoleIcon className="w-3 h-3" />
                {roles.find((r) => r.id === member.role)?.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
