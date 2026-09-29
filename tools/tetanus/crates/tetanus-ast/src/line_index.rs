//! Byte-offset to line-number mapping.
//!
//! oxc spans are byte offsets. Line numbers are derived here rather than pulled
//! from the parser so that a file is indexed once and every later lookup is
//! O(log n), and so the derivation is identical in every consumer.

#[derive(Debug, Clone)]
pub struct LineIndex {
    /// Byte offset of the first character of each line.
    starts: Vec<u32>,
}

impl LineIndex {
    pub fn new(source: &str) -> Self {
        let bytes = source.as_bytes();
        let mut starts = vec![0u32];
        for (offset, byte) in bytes.iter().enumerate() {
            if *byte == b'\n' {
                starts.push(offset as u32 + 1);
            }
        }
        Self { starts }
    }

    /// One-based line containing `offset`.
    pub fn line_of(&self, offset: u32) -> u32 {
        match self.starts.binary_search(&offset) {
            Ok(index) => index as u32 + 1,
            Err(index) => index as u32,
        }
    }

    /// One-based line and one-based column of `offset`.
    pub fn locate(&self, source: &str, offset: u32) -> (u32, u32) {
        let line_index = self.line_of(offset) as usize - 1;
        let line_start = self.starts[line_index] as usize;
        let column = source
            .get(line_start..offset as usize)
            .map(|s| s.chars().count())
            .unwrap_or(0)
            + 1;
        (line_index as u32 + 1, column as u32)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn maps_offsets_to_one_based_lines() {
        let index = LineIndex::new("a\nbb\nccc");
        assert_eq!(index.line_of(0), 1);
        assert_eq!(index.line_of(2), 2);
        assert_eq!(index.line_of(5), 3);
    }

    #[test]
    fn empty_source_has_one_line() {
        let index = LineIndex::new("");
        assert_eq!(index.line_of(0), 1);
    }

    #[test]
    fn locates_columns() {
        let source = "ab\ncde";
        let index = LineIndex::new(source);
        assert_eq!(index.locate(source, 0), (1, 1));
        assert_eq!(index.locate(source, 4), (2, 2));
    }
}
