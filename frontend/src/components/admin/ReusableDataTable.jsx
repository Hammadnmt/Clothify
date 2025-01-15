import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { EllipsisVertical, Pencil, Trash, View } from "lucide-react";
import AlertMessage from "../AlertMessage";

/**
 * Dynamic Reusable Data Table Component
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of data to be displayed
 * @param {Array} props.columns - Column configuration
 * @param {Function} props.onView - Function to handle view action
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {React.ComponentType} props.ViewComponent - Component to render in drawer for detailed view
 * @param {React.ComponentType} props.EditFormComponent - Component to render in dialog for editing
 * @param {Object} props.formConfig - Object of dynamic form config
 * @param {string} props.caption - Table caption
 * @param {boolean} props.isLoading - Loading state
 */
export default function ReusableDataTable({
  data,
  columns,
  onView,
  onEdit,
  onDelete,
  ViewComponent,
  EditFormComponent,
  caption = "A list of items",
  isLoading = false,
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleView = (id) => {
    setSelectedItemId(id);
    setIsDrawerOpen(true);
    if (onView) onView(id);
  };

  const handleEdit = (item, id) => {
    if (onEdit) {
      onEdit(item, id);
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = (id) => {
    if (onDelete) onDelete(id);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItemId(null);
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item);
    }

    const value = column.key.split(".").reduce((obj, key) => obj?.[key], item);

    return column.format ? column.format(value) : value?.toString() ?? "";
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableCaption className="text-gray-500">{caption}</TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-100 rounded-lg">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={`text-left ${column.headerClassName || ""}`}
                >
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item._id} className="hover:bg-gray-100">
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`py-2 px-4 border-b ${
                      column.cellClassName || ""
                    }`}
                  >
                    {renderCellContent(item, column)}
                  </TableCell>
                ))}
                <TableCell className="py-2 px-4 border-b text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={isLoading}
                        variant="outline"
                        className="text-sm"
                      >
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      {ViewComponent && (
                        <DropdownMenuItem onClick={() => handleView(item._id)}>
                          <Button
                            variant="ghost"
                            className="font-normal w-full"
                          >
                            <View />
                            View
                          </Button>
                        </DropdownMenuItem>
                      )}
                      {EditFormComponent && (
                        <DropdownMenuItem asChild>
                          <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={(open) => setIsEditDialogOpen(open)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="font-normal w-full"
                                onClick={() => setIsEditDialogOpen(true)}
                              >
                                <Pencil />
                                Update
                              </Button>
                            </DialogTrigger>

                            <EditFormComponent
                              onSubmit={(updatedData, id) =>
                                handleEdit(updatedData, id)
                              }
                              data={item}
                              isEdit={true}
                              isLoading={isLoading}
                            />
                          </Dialog>
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem asChild className="text-red-600">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="font-normal w-full hover:bg-red-100 hover:text-red-600"
                              >
                                <Trash />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertMessage
                              handleAction={() => handleDelete(item._id)}
                            />
                          </AlertDialog>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isDrawerOpen && ViewComponent && (
        <Drawer
          onOpenChange={(isOpen) => {
            if (!isOpen) closeDrawer();
          }}
          open={isDrawerOpen}
        >
          <DrawerContent className="bg-gray-300 max-h-[90vh] rounded-lg">
            <ViewComponent id={selectedItemId} />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
