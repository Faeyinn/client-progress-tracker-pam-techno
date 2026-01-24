import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectActionsProps {
  projectId: string;
  onDelete: () => void;
}

export function ProjectActions({ projectId, onDelete }: ProjectActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href={`/admin/projects/${projectId}/edit`}>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="icon" className="sm:hidden h-9 w-9">
          <Edit className="w-4 h-4" />
        </Button>
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 hover:border-destructive/50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/30 hover:border-destructive/50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data proyek akan dihapus
              secara permanen dari database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-foreground hover:bg-foreground/90 text-background border-none"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
