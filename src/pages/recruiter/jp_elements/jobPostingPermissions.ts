export type JobPostingStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "DELETED";

export const getPermissionsByStatus = (status: JobPostingStatus) => {
    return {
        canEditFields: status === 'ACTIVE' || status === 'INACTIVE',
        canAddCVs: status === 'ACTIVE',
        canChangeStatus: status !== 'DELETED',
    };
};
