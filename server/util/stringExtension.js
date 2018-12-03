String.prototype.fileNameClean = function(ext) {
  return (this.replace(/[^a-z0-9_\-]/gi, '_') + ext).toLowerCase();
};
