"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import PortalTableContainer from "@/app/_components/PortalComponents/Portal/PortalTableContainer";
import { type TeamRoleInput, teamRoleSchema } from "@/app/_lib/teamRoles";
import { runPortalAction } from "@/app/portal/_lib/runAction";
import { deleteTeamRole, saveTeamRole } from "@/app/portal/actions";
import { Button } from "@/components/ui/button";
import type { TeamRole } from "@/generated/prisma/browser";

type ManagedRole = TeamRole & { _count: { users: number } };
const emptyRole: TeamRoleInput = {
  name: "",
  section: "",
  adminOnly: false,
  sortOrder: 0,
};
const inputClass =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-sc-red";

export default function TeamRolesManager({ roles }: { roles: ManagedRole[] }) {
  const router = useRouter();
  const nameInput = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number>();
  const [draft, setDraft] = useState<TeamRoleInput>(emptyRole);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number>();
  const sections = [...new Set(roles.map((role) => role.section))];
  const filteredRoles = roles.filter((role) =>
    `${role.name} ${role.section}`.toLowerCase().includes(query.toLowerCase()),
  );

  function resetEditor() {
    setEditingId(undefined);
    setDraft(emptyRole);
    setError("");
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = teamRoleSchema.safeParse(draft);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the role details.");
      return;
    }
    setError("");
    setBusy(true);
    const result = await runPortalAction(
      () => saveTeamRole({ ...parsed.data, id: editingId }),
      { loading: "Saving role...", success: "Team role saved." },
    );
    setBusy(false);
    if (result.success) {
      resetEditor();
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  async function remove(id: number) {
    setBusy(true);
    const result = await runPortalAction(() => deleteTeamRole({ id }), {
      loading: "Deleting role...",
      success: "Team role deleted.",
    });
    setBusy(false);
    setDeletingId(undefined);
    if (result.success) {
      if (editingId === id) resetEditor();
      router.refresh();
    }
  }

  return (
    <>
      <div>
        <h1 className="m-0 text-2xl font-semibold">Team Roles</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Manage the roles available in member profiles. Team sections organize
          the public team page. Renaming a role updates everyone assigned to it,
          including alumni.
        </p>
      </div>
      <section
        aria-labelledby="role-editor-heading"
        className="rounded-xl border border-slate-200 bg-white p-5"
      >
        <h2 className="m-0 text-lg font-semibold" id="role-editor-heading">
          {editingId ? "Edit role" : "Add role"}
        </h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          onSubmit={save}
        >
          <fieldset className="contents" disabled={busy}>
            <label className="text-sm font-medium" htmlFor="role-name">
              Role name
              <input
                autoComplete="off"
                className={inputClass}
                id="role-name"
                maxLength={100}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                ref={nameInput}
                required
                value={draft.name}
              />
            </label>
            <label className="text-sm font-medium" htmlFor="role-section">
              Team section
              <input
                autoComplete="off"
                className={inputClass}
                id="role-section"
                list="team-sections"
                maxLength={100}
                onChange={(event) =>
                  setDraft({ ...draft, section: event.target.value })
                }
                placeholder="Choose or create a section"
                required
                value={draft.section}
              />
              <datalist id="team-sections">
                {sections.map((section) => (
                  <option key={section} value={section} />
                ))}
              </datalist>
            </label>
            <label className="text-sm font-medium" htmlFor="role-order">
              Display order
              <input
                aria-describedby="role-order-help"
                className={inputClass}
                id="role-order"
                max={100000}
                min={0}
                onChange={(event) =>
                  setDraft({ ...draft, sortOrder: event.target.valueAsNumber })
                }
                required
                step={1}
                type="number"
                value={Number.isNaN(draft.sortOrder) ? "" : draft.sortOrder}
              />
              <span
                className="mt-1 block text-xs font-normal text-slate-500"
                id="role-order-help"
              >
                Lower numbers appear first. Sections follow their first role.
              </span>
            </label>
            <label
              className="flex items-start gap-2 text-sm sm:col-span-2 lg:col-span-3"
              htmlFor="role-restricted"
            >
              <input
                checked={draft.adminOnly}
                className="mt-1"
                id="role-restricted"
                onChange={(event) =>
                  setDraft({ ...draft, adminOnly: event.target.checked })
                }
                type="checkbox"
              />
              <span>
                <span className="font-medium">
                  Only admins can assign this role
                </span>
                <br />
                <span className="text-slate-500">
                  Use for leadership positions. Members can still edit their
                  profile while keeping this role.
                </span>
              </span>
            </label>
            {error && (
              <p
                className="m-0 text-sm text-red-700 sm:col-span-2 lg:col-span-3"
                role="alert"
              >
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-3">
              <Button disabled={busy} type="submit">
                {busy ? "Saving..." : editingId ? "Save changes" : "Add role"}
              </Button>
              {editingId && (
                <Button
                  disabled={busy}
                  onClick={resetEditor}
                  type="button"
                  variant="outline"
                >
                  Cancel editing
                </Button>
              )}
            </div>
          </fieldset>
        </form>
      </section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="m-0 text-lg font-semibold">
            Available roles ({roles.length})
          </h2>
          <p className="mt-1 mb-0 text-sm text-slate-500">
            Reassign all members before deleting a role.
          </p>
        </div>
        <label
          className="w-full text-sm font-medium sm:w-72"
          htmlFor="role-search"
        >
          Search roles
          <input
            className={inputClass}
            id="role-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Name or section..."
            type="search"
            value={query}
          />
        </label>
      </div>
      <PortalTableContainer>
        <table>
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Team section</th>
              <th scope="col">Order</th>
              <th scope="col">Assignment</th>
              <th scope="col">Members</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((role) => (
              <tr key={role.id}>
                <td className="font-medium">{role.name}</td>
                <td>{role.section}</td>
                <td>{role.sortOrder}</td>
                <td>{role.adminOnly ? "Admins only" : "All members"}</td>
                <td>{role._count.users}</td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      aria-label={`Edit ${role.name}`}
                      disabled={busy}
                      onClick={() => {
                        setEditingId(role.id);
                        setDraft({
                          name: role.name,
                          section: role.section,
                          sortOrder: role.sortOrder,
                          adminOnly: role.adminOnly,
                        });
                        setError("");
                        nameInput.current?.focus();
                      }}
                      type="button"
                      variant="outline"
                    >
                      Edit
                    </Button>
                    {deletingId === role.id ? (
                      <>
                        <Button
                          aria-label={`Confirm delete ${role.name}`}
                          disabled={busy}
                          onClick={() => remove(role.id)}
                          type="button"
                          variant="destructive"
                        >
                          Confirm delete
                        </Button>
                        <Button
                          disabled={busy}
                          onClick={() => setDeletingId(undefined)}
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        aria-label={`Delete ${role.name}`}
                        disabled={busy || role._count.users > 0}
                        onClick={() => setDeletingId(role.id)}
                        title={
                          role._count.users > 0
                            ? "Reassign members before deleting this role"
                            : undefined
                        }
                        type="button"
                        variant="outline"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredRoles.length === 0 && (
              <tr>
                <td colSpan={6}>
                  {roles.length
                    ? "No roles match your search."
                    : "No team roles yet. Add your first role above."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </PortalTableContainer>
    </>
  );
}
