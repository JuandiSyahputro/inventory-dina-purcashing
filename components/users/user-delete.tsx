"use client";
import { deleteUsers } from "@/actions/users-action";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useTransition } from "react";
import { toast } from "sonner";

const UserDeleted = ({ user, openDialog, setOpenDialog }: UserUpdatedTypes) => {
  const { refresh } = useRouter();
  const [pending, startTransition] = useTransition();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const result = await deleteUsers(user.id);
        if (!result?.success) {
          if (Array.isArray(result?.message)) {
            // If result.message is an array, you can map over it and create a ReactNode array
            const errorMessage = result.message.map((error, index) => <div key={index}>{error.message}</div>);
            toast.error(errorMessage, {
              style: {
                color: "var(--color-destructive)",
              },
            });
          } else {
            // If result.message is a string, you can directly pass it to toast.error
            toast.error(result!.message, {
              style: {
                color: "var(--color-destructive)",
              },
            });
          }
          return;
        }

        toast.success("User deleted successfully", {
          style: {
            color: "var(--color-custom-success)",
          },
        });

        refresh();
        setTimeout(() => setOpenDialog((prev) => ({ ...prev, deletedUser: false })), 500);
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Dialog open={openDialog} onOpenChange={() => setOpenDialog((prev) => ({ ...prev, deletedUser: !prev.deletedUser }))}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="flex justify-center">
              <TriangleAlert size={80} className="text-yellow-500" />
            </DialogTitle>
            <DialogDescription>Are you sure you want to delete this user? This action cannot be undone, and all data associated with this user will be permanently deleted.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button disabled={pending} variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={pending} type="submit" className="cursor-pointer bg-destructive hover:bg-red-700">
              {pending ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default memo(UserDeleted);
