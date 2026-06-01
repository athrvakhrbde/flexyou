-- CreateTable
CREATE TABLE "ImageProductTag" (
    "id" TEXT NOT NULL,
    "flexItemId" TEXT NOT NULL,
    "imageIndex" INTEGER NOT NULL DEFAULT 0,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "estimatedValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ImageProductTag_flexItemId_idx" ON "ImageProductTag"("flexItemId");

-- CreateIndex
CREATE INDEX "ImageProductTag_flexItemId_imageIndex_idx" ON "ImageProductTag"("flexItemId", "imageIndex");

-- AddForeignKey
ALTER TABLE "ImageProductTag" ADD CONSTRAINT "ImageProductTag_flexItemId_fkey" FOREIGN KEY ("flexItemId") REFERENCES "FlexItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
