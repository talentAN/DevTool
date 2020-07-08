export const API_Endpoints = {
  es_6_0: {
    name: "es_6_0",
    globals: {
      aliases: {
        "*": {
          filter: {},
          routing: "1",
          search_routing: "1,2",
          index_routing: "1",
        },
      },
      aggregations: {
        "*": {
          aggs: { __template: { NAME: { AGG_TYPE: {} } } },
          adjacency_matrix: { filters: {} },
          diversified_sampler: { shard_size: "", field: "" },
          min: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          max: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          avg: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          sum: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          stats: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          extended_stats: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          value_count: {
            __template: { field: "" },
            field: "{field}",
            script: {},
          },
          global: {},
          filter: {},
          filters: {
            __template: { filters: { NAME: {} } },
            filters: { "*": { __scope_link: "GLOBAL.filter" } },
            other_bucket: { __one_of: [true, false] },
            other_bucket_key: "",
          },
          missing: { __template: { field: "" }, field: "{field}" },
          nested: { __template: { path: "" }, path: "" },
          reverse_nested: { __template: { path: "" }, path: "" },
          terms: {
            __template: { field: "", size: 10 },
            field: "{field}",
            size: 10,
            shard_size: 10,
            order: {
              __template: { _term: "asc" },
              _term: { __one_of: ["asc", "desc"] },
              _count: { __one_of: ["asc", "desc"] },
              "*": { __one_of: ["asc", "desc"] },
            },
            min_doc_count: 10,
            script: {},
            include: ".*",
            exclude: ".*",
            execution_hint: {
              __one_of: [
                "map",
                "global_ordinals",
                "global_ordinals_hash",
                "global_ordinals_low_cardinality",
              ],
            },
            show_term_doc_count_error: { __one_of: [true, false] },
            collect_mode: { __one_of: ["depth_first", "breadth_first"] },
            missing: "",
          },
          significant_text: {
            __template: { field: "" },
            field: "{field}",
            size: 10,
            shard_size: 10,
            shard_min_doc_count: 10,
            min_doc_count: 10,
            include: { __one_of: ["*", { pattern: "", flags: "" }] },
            exclude: { __one_of: ["*", { pattern: "", flags: "" }] },
            execution_hint: {
              __one_of: ["map", "global_ordinals", "global_ordinals_hash"],
            },
            background_filter: { __scope_link: "GLOBAL.filter" },
            mutual_information: {
              include_negatives: { __one_of: [true, false] },
            },
            chi_square: {
              include_negatives: { __one_of: [true, false] },
              background_is_superset: { __one_of: [true, false] },
            },
            percentage: {},
            gnd: { background_is_superset: { __one_of: [true, false] } },
            script_heuristic: {
              __template: {
                script: "_subset_freq/(_superset_freq - _subset_freq + 1)",
              },
              script: {},
            },
            filter_duplicate_text: "__flag__",
          },
          significant_terms: {
            __template: { field: "" },
            field: "{field}",
            size: 10,
            shard_size: 10,
            shard_min_doc_count: 10,
            min_doc_count: 10,
            include: { __one_of: ["*", { pattern: "", flags: "" }] },
            exclude: { __one_of: ["*", { pattern: "", flags: "" }] },
            execution_hint: {
              __one_of: ["map", "global_ordinals", "global_ordinals_hash"],
            },
            background_filter: { __scope_link: "GLOBAL.filter" },
            mutual_information: {
              include_negatives: { __one_of: [true, false] },
            },
            chi_square: {
              include_negatives: { __one_of: [true, false] },
              background_is_superset: { __one_of: [true, false] },
            },
            percentage: {},
            gnd: { background_is_superset: { __one_of: [true, false] } },
            script_heuristic: {
              __template: {
                script: "_subset_freq/(_superset_freq - _subset_freq + 1)",
              },
              script: {},
            },
          },
          range: {
            __template: { field: "", ranges: [{ from: 50, to: 100 }] },
            field: "{field}",
            ranges: [{ to: 50, from: 100, key: "" }],
            keyed: { __one_of: [true, false] },
            script: {},
          },
          date_range: {
            __template: {
              field: "",
              ranges: [{ from: "now-10d/d", to: "now" }],
            },
            field: "{field}",
            format: "MM-yyy",
            ranges: [{ to: "", from: "", key: "" }],
            keyed: { __one_of: [true, false] },
            script: {},
          },
          ip_range: {
            __template: {
              field: "",
              ranges: [{ from: "10.0.0.5", to: "10.0.0.10" }],
            },
            field: "{field}",
            format: "MM-yyy",
            ranges: [{ to: "", from: "", key: "", mask: "10.0.0.127/25" }],
            keyed: { __one_of: [true, false] },
            script: {},
          },
          histogram: {
            __template: { field: "price", interval: 50 },
            field: "{field}",
            interval: 50,
            extended_bounds: {
              __template: { min: 0, max: 50 },
              min: 0,
              max: 50,
            },
            min_doc_count: 0,
            order: {
              __template: { _key: "asc" },
              _key: { __one_of: ["asc", "desc"] },
              _count: { __one_of: ["asc", "desc"] },
              "*": { __one_of: ["asc", "desc"] },
            },
            keyed: { __one_of: [true, false] },
            missing: 0,
          },
          date_histogram: {
            __template: { field: "date", interval: "month" },
            field: "{field}",
            interval: {
              __one_of: [
                "year",
                "quarter",
                "week",
                "day",
                "hour",
                "minute",
                "second",
              ],
            },
            min_doc_count: 0,
            extended_bounds: {
              __template: { min: "now/d", max: "now/d" },
              min: "now/d",
              max: "now/d",
            },
            order: {
              __template: { _key: "asc" },
              _key: { __one_of: ["asc", "desc"] },
              _count: { __one_of: ["asc", "desc"] },
              "*": { __one_of: ["asc", "desc"] },
            },
            keyed: { __one_of: [true, false] },
            pre_zone: "-01:00",
            post_zone: "-01:00",
            pre_zone_adjust_large_interval: { __one_of: [true, false] },
            factor: 1000,
            pre_offset: "1d",
            post_offset: "1d",
            format: "yyyy-MM-dd",
            time_zone: "00:00",
            missing: "",
          },
          geo_distance: {
            __template: {
              field: "location",
              origin: { lat: 52.376, lon: 4.894 },
              ranges: [{ from: 100, to: 300 }],
            },
            field: "{field}",
            origin: { lat: 0, lon: 0 },
            unit: { __one_of: ["mi", "km", "in", "yd", "m", "cm", "mm"] },
            ranges: [{ from: 50, to: 100 }],
            distance_type: { __one_of: ["arc", "sloppy_arc", "plane"] },
          },
          geohash_grid: {
            __template: { field: "", precision: 3 },
            field: "{field}",
            precision: { __one_of: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
            size: 10,
            shard_size: 10,
          },
          composite: {
            __template: { sources: [{ NAME: { AGG_TYPE: {} } }] },
            sources: [
              { __scope_link: ".", __template: { NAME: { AGG_TYPE: {} } } },
            ],
            size: 10,
            after: {},
          },
          percentiles: {
            __template: { field: "", percents: [1, 5, 25, 50, 75, 95, 99] },
            field: "{field}",
            percents: { __template: [1, 5, 25, 50, 75, 95, 99], __any_of: [] },
            script: {},
            compression: 100,
            method: { __one_of: ["hdr", "tdigest"] },
            missing: 0,
          },
          cardinality: {
            __template: { field: "" },
            precision_threshold: 100,
            rehash: true,
            script: {},
            missing: "",
          },
          scripted_metric: {
            __template: {
              init_script: "",
              map_script: "",
              combine_script: "",
              reduce_script: "",
            },
            init_script: { __scope_link: "GLOBAL.script" },
            map_script: { __scope_link: "GLOBAL.script" },
            combine_script: { __scope_link: "GLOBAL.script" },
            reduce_script: { __scope_link: "GLOBAL.script" },
            lang: "groovy",
            params: {},
            reduce_params: {},
          },
          geo_bounds: {
            __template: { field: "" },
            field: "{field}",
            wrap_longitude: { __one_of: [true, false] },
          },
          top_hits: {
            __template: { size: 10 },
            from: 0,
            size: 10,
            sort: { __template: [], __scope_link: "search.sort" },
            highlight: {},
            explain: { __one_of: [true, false] },
            _source: { __template: "", __scope_link: "search._source" },
            script_fields: { __scope_link: "search.script_fields" },
            docvalue_fields: ["{field}"],
            version: { __one_of: [true, false] },
          },
          percentile_ranks: {
            __template: { field: "", values: [10, 15] },
            field: "{field}",
            values: [],
            script: {},
            compression: 100,
            method: { __one_of: ["hdr", "tdigest"] },
            missing: 0,
          },
          sampler: {
            __template: {},
            field: "{field}",
            script: {},
            shard_size: 100,
            max_docs_per_value: 3,
            execution_hint: {
              __one_of: ["map", "global_ordinals", "bytes_hash"],
            },
          },
          children: { __template: { type: "" }, type: "" },
          derivative: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          avg_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          max_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          min_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          stats_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          extended_stats_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            sigma: "",
          },
          percentiles_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            percents: [],
          },
          sum_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          moving_avg: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            window: 5,
            model: {
              __one_of: ["simple", "linear", "ewma", "holt", "holt_winters"],
            },
            settings: {
              type: { __one_of: ["add", "mult"] },
              alpha: 0.5,
              beta: 0.5,
              gamma: 0.5,
              period: 7,
            },
          },
          cumulative_sum: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
          },
          serial_diff: {
            __template: { buckets_path: "", lag: 7 },
            lag: 7,
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            buckets_path: "",
            format: "",
          },
          bucket_script: {
            __template: { buckets_path: {}, script: "" },
            buckets_path: {},
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            script: "",
          },
          bucket_selector: {
            __template: { buckets_path: {}, script: "" },
            buckets_path: {},
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            script: "",
          },
          bucket_sort: {
            __template: { sort: [] },
            sort: ["{field}"],
            from: 0,
            size: 0,
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          matrix_stats: { __template: { fields: [] }, fields: ["{field}"] },
        },
      },
      aggs: {
        "*": {
          aggs: { __template: { NAME: { AGG_TYPE: {} } } },
          adjacency_matrix: { filters: {} },
          diversified_sampler: { shard_size: "", field: "" },
          min: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          max: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          avg: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          sum: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          stats: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          extended_stats: {
            __template: { field: "" },
            field: "{field}",
            missing: 0,
            script: {},
          },
          value_count: {
            __template: { field: "" },
            field: "{field}",
            script: {},
          },
          global: {},
          filter: {},
          filters: {
            __template: { filters: { NAME: {} } },
            filters: { "*": { __scope_link: "GLOBAL.filter" } },
            other_bucket: { __one_of: [true, false] },
            other_bucket_key: "",
          },
          missing: { __template: { field: "" }, field: "{field}" },
          nested: { __template: { path: "" }, path: "" },
          reverse_nested: { __template: { path: "" }, path: "" },
          terms: {
            __template: { field: "", size: 10 },
            field: "{field}",
            size: 10,
            shard_size: 10,
            order: {
              __template: { _term: "asc" },
              _term: { __one_of: ["asc", "desc"] },
              _count: { __one_of: ["asc", "desc"] },
              "*": { __one_of: ["asc", "desc"] },
            },
            min_doc_count: 10,
            script: {},
            include: ".*",
            exclude: ".*",
            execution_hint: {
              __one_of: [
                "map",
                "global_ordinals",
                "global_ordinals_hash",
                "global_ordinals_low_cardinality",
              ],
            },
            show_term_doc_count_error: { __one_of: [true, false] },
            collect_mode: { __one_of: ["depth_first", "breadth_first"] },
            missing: "",
          },
          significant_text: {
            __template: { field: "" },
            field: "{field}",
            size: 10,
            shard_size: 10,
            shard_min_doc_count: 10,
            min_doc_count: 10,
            include: { __one_of: ["*", { pattern: "", flags: "" }] },
            exclude: { __one_of: ["*", { pattern: "", flags: "" }] },
            execution_hint: {
              __one_of: ["map", "global_ordinals", "global_ordinals_hash"],
            },
            background_filter: { __scope_link: "GLOBAL.filter" },
            mutual_information: {
              include_negatives: { __one_of: [true, false] },
            },
            chi_square: {
              include_negatives: { __one_of: [true, false] },
              background_is_superset: { __one_of: [true, false] },
            },
            percentage: {},
            gnd: { background_is_superset: { __one_of: [true, false] } },
            script_heuristic: {
              __template: {
                script: "_subset_freq/(_superset_freq - _subset_freq + 1)",
              },
              script: {},
            },
            filter_duplicate_text: "__flag__",
          },
          significant_terms: {
            __template: { field: "" },
            field: "{field}",
            size: 10,
            shard_size: 10,
            shard_min_doc_count: 10,
            min_doc_count: 10,
            include: { __one_of: ["*", { pattern: "", flags: "" }] },
            exclude: { __one_of: ["*", { pattern: "", flags: "" }] },
            execution_hint: {
              __one_of: ["map", "global_ordinals", "global_ordinals_hash"],
            },
            background_filter: { __scope_link: "GLOBAL.filter" },
            mutual_information: {
              include_negatives: { __one_of: [true, false] },
            },
            chi_square: {
              include_negatives: { __one_of: [true, false] },
              background_is_superset: { __one_of: [true, false] },
            },
            percentage: {},
            gnd: { background_is_superset: { __one_of: [true, false] } },
            script_heuristic: {
              __template: {
                script: "_subset_freq/(_superset_freq - _subset_freq + 1)",
              },
              script: {},
            },
          },
          range: {
            __template: { field: "", ranges: [{ from: 50, to: 100 }] },
            field: "{field}",
            ranges: [{ to: 50, from: 100, key: "" }],
            keyed: { __one_of: [true, false] },
            script: {},
          },
          date_range: {
            __template: {
              field: "",
              ranges: [{ from: "now-10d/d", to: "now" }],
            },
            field: "{field}",
            format: "MM-yyy",
            ranges: [{ to: "", from: "", key: "" }],
            keyed: { __one_of: [true, false] },
            script: {},
          },
          ip_range: {
            __template: {
              field: "",
              ranges: [{ from: "10.0.0.5", to: "10.0.0.10" }],
            },
            field: "{field}",
            format: "MM-yyy",
            ranges: [{ to: "", from: "", key: "", mask: "10.0.0.127/25" }],
            keyed: { __one_of: [true, false] },
            script: {},
          },
          histogram: {
            __template: { field: "price", interval: 50 },
            field: "{field}",
            interval: 50,
            extended_bounds: {
              __template: { min: 0, max: 50 },
              min: 0,
              max: 50,
            },
            min_doc_count: 0,
            order: {
              __template: { _key: "asc" },
              _key: { __one_of: ["asc", "desc"] },
              _count: { __one_of: ["asc", "desc"] },
              "*": { __one_of: ["asc", "desc"] },
            },
            keyed: { __one_of: [true, false] },
            missing: 0,
          },
          date_histogram: {
            __template: { field: "date", interval: "month" },
            field: "{field}",
            interval: {
              __one_of: [
                "year",
                "quarter",
                "week",
                "day",
                "hour",
                "minute",
                "second",
              ],
            },
            min_doc_count: 0,
            extended_bounds: {
              __template: { min: "now/d", max: "now/d" },
              min: "now/d",
              max: "now/d",
            },
            order: {
              __template: { _key: "asc" },
              _key: { __one_of: ["asc", "desc"] },
              _count: { __one_of: ["asc", "desc"] },
              "*": { __one_of: ["asc", "desc"] },
            },
            keyed: { __one_of: [true, false] },
            pre_zone: "-01:00",
            post_zone: "-01:00",
            pre_zone_adjust_large_interval: { __one_of: [true, false] },
            factor: 1000,
            pre_offset: "1d",
            post_offset: "1d",
            format: "yyyy-MM-dd",
            time_zone: "00:00",
            missing: "",
          },
          geo_distance: {
            __template: {
              field: "location",
              origin: { lat: 52.376, lon: 4.894 },
              ranges: [{ from: 100, to: 300 }],
            },
            field: "{field}",
            origin: { lat: 0, lon: 0 },
            unit: { __one_of: ["mi", "km", "in", "yd", "m", "cm", "mm"] },
            ranges: [{ from: 50, to: 100 }],
            distance_type: { __one_of: ["arc", "sloppy_arc", "plane"] },
          },
          geohash_grid: {
            __template: { field: "", precision: 3 },
            field: "{field}",
            precision: { __one_of: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
            size: 10,
            shard_size: 10,
          },
          composite: {
            __template: { sources: [{ NAME: { AGG_TYPE: {} } }] },
            sources: [
              { __scope_link: ".", __template: { NAME: { AGG_TYPE: {} } } },
            ],
            size: 10,
            after: {},
          },
          percentiles: {
            __template: { field: "", percents: [1, 5, 25, 50, 75, 95, 99] },
            field: "{field}",
            percents: { __template: [1, 5, 25, 50, 75, 95, 99], __any_of: [] },
            script: {},
            compression: 100,
            method: { __one_of: ["hdr", "tdigest"] },
            missing: 0,
          },
          cardinality: {
            __template: { field: "" },
            precision_threshold: 100,
            rehash: true,
            script: {},
            missing: "",
          },
          scripted_metric: {
            __template: {
              init_script: "",
              map_script: "",
              combine_script: "",
              reduce_script: "",
            },
            init_script: { __scope_link: "GLOBAL.script" },
            map_script: { __scope_link: "GLOBAL.script" },
            combine_script: { __scope_link: "GLOBAL.script" },
            reduce_script: { __scope_link: "GLOBAL.script" },
            lang: "groovy",
            params: {},
            reduce_params: {},
          },
          geo_bounds: {
            __template: { field: "" },
            field: "{field}",
            wrap_longitude: { __one_of: [true, false] },
          },
          top_hits: {
            __template: { size: 10 },
            from: 0,
            size: 10,
            sort: { __template: [], __scope_link: "search.sort" },
            highlight: {},
            explain: { __one_of: [true, false] },
            _source: { __template: "", __scope_link: "search._source" },
            script_fields: { __scope_link: "search.script_fields" },
            docvalue_fields: ["{field}"],
            version: { __one_of: [true, false] },
          },
          percentile_ranks: {
            __template: { field: "", values: [10, 15] },
            field: "{field}",
            values: [],
            script: {},
            compression: 100,
            method: { __one_of: ["hdr", "tdigest"] },
            missing: 0,
          },
          sampler: {
            __template: {},
            field: "{field}",
            script: {},
            shard_size: 100,
            max_docs_per_value: 3,
            execution_hint: {
              __one_of: ["map", "global_ordinals", "bytes_hash"],
            },
          },
          children: { __template: { type: "" }, type: "" },
          derivative: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          avg_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          max_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          min_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          stats_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          extended_stats_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            sigma: "",
          },
          percentiles_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            percents: [],
          },
          sum_bucket: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          moving_avg: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            window: 5,
            model: {
              __one_of: ["simple", "linear", "ewma", "holt", "holt_winters"],
            },
            settings: {
              type: { __one_of: ["add", "mult"] },
              alpha: 0.5,
              beta: 0.5,
              gamma: 0.5,
              period: 7,
            },
          },
          cumulative_sum: {
            __template: { buckets_path: "" },
            buckets_path: "",
            format: "",
          },
          serial_diff: {
            __template: { buckets_path: "", lag: 7 },
            lag: 7,
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            buckets_path: "",
            format: "",
          },
          bucket_script: {
            __template: { buckets_path: {}, script: "" },
            buckets_path: {},
            format: "",
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            script: "",
          },
          bucket_selector: {
            __template: { buckets_path: {}, script: "" },
            buckets_path: {},
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
            script: "",
          },
          bucket_sort: {
            __template: { sort: [] },
            sort: ["{field}"],
            from: 0,
            size: 0,
            gap_policy: { __one_of: ["skip", "insert_zeros"] },
          },
          matrix_stats: { __template: { fields: [] }, fields: ["{field}"] },
        },
      },
      filter: {
        and: {
          __template: { filters: [{}] },
          filters: [{ __scope_link: "." }],
        },
        bool: { __scope_link: "GLOBAL.query" },
        exists: { __template: { field: "FIELD_NAME" }, field: "{field}" },
        ids: { __template: { values: ["ID"] }, type: "{type}", values: [""] },
        limit: { __template: { value: 100 }, value: 100 },
        type: { __template: { value: "TYPE" }, value: "{type}" },
        geo_bounding_box: {
          __template: {
            FIELD: {
              top_left: { lat: 40.73, lon: -74.1 },
              bottom_right: { lat: 40.717, lon: -73.99 },
            },
          },
          "{field}": {
            top_left: { lat: 40.73, lon: -74.1 },
            bottom_right: { lat: 40.73, lon: -74.1 },
          },
          type: { __one_of: ["memory", "indexed"] },
        },
        geo_distance: {
          __template: {
            distance: 100,
            distance_unit: "km",
            FIELD: { lat: 40.73, lon: -74.1 },
          },
          distance: 100,
          distance_unit: { __one_of: ["km", "miles"] },
          distance_type: { __one_of: ["arc", "plane"] },
          optimize_bbox: { __one_of: ["memory", "indexed", "none"] },
          "{field}": { lat: 40.73, lon: -74.1 },
        },
        geo_distance_range: {
          __template: {
            from: 100,
            to: 200,
            distance_unit: "km",
            FIELD: { lat: 40.73, lon: -74.1 },
          },
          from: 100,
          to: 200,
          distance_unit: { __one_of: ["km", "miles"] },
          distance_type: { __one_of: ["arc", "plane"] },
          include_lower: { __one_of: [true, false] },
          include_upper: { __one_of: [true, false] },
          "{field}": { lat: 40.73, lon: -74.1 },
        },
        geo_polygon: {
          __template: {
            FIELD: {
              points: [
                { lat: 40.73, lon: -74.1 },
                { lat: 40.83, lon: -75.1 },
              ],
            },
          },
          "{field}": { points: [{ lat: 40.73, lon: -74.1 }] },
        },
        geo_shape: {
          __template: {
            FIELD: {
              shape: {
                type: "envelope",
                coordinates: [
                  [-45, 45],
                  [45, -45],
                ],
              },
              relation: "within",
            },
          },
          "{field}": {
            shape: { type: "", coordinates: [] },
            indexed_shape: {
              id: "",
              index: "{index}",
              type: "{type}",
              shape_field_name: "shape",
            },
            relation: { __one_of: ["within", "intersects", "disjoint"] },
          },
        },
        has_child: {
          __template: { type: "TYPE", filter: {} },
          type: "{type}",
          query: {},
          filter: {},
          _scope: "",
          min_children: 1,
          max_children: 10,
        },
        has_parent: {
          __template: { parent_type: "TYPE", filter: {} },
          parent_type: "{type}",
          query: {},
          filter: {},
          _scope: "",
        },
        missing: {
          __template: { field: "FIELD" },
          existence: { __one_of: [true, false] },
          null_value: { __one_of: [true, false] },
          field: "{field}",
        },
        m: {
          __template: { field: "FIELD" },
          existence: { __one_of: [true, false] },
          null_value: { __one_of: [true, false] },
          field: "{field}",
        },
        not: { __template: { filter: {} }, filter: {} },
        range: {
          __template: { FIELD: { gte: 10, lte: 20 } },
          "{field}": {
            gte: 1,
            gt: 1,
            lte: 20,
            lt: 20,
            time_zone: "+1:00",
            format: "dd/MM/yyyy||yyyy",
            execution: { __one_of: ["index", "fielddata"] },
          },
        },
        or: { __template: { filters: [{}] }, filters: [{ __scope_link: "." }] },
        prefix: { __template: { FIELD: "VALUE" }, "{field}": "" },
        query: {},
        script: { __template: { script: {} }, script: {} },
        term: { __template: { FIELD: "VALUE" }, "{field}": "" },
        terms: {
          __template: { FIELD: ["VALUE1", "VALUE2"] },
          field: ["{field}"],
          execution: {
            __one_of: [
              "plain",
              "bool",
              "and",
              "or",
              "bool_nocache",
              "and_nocache",
              "or_nocache",
            ],
          },
        },
        nested: {
          __template: { path: "path_to_nested_doc", query: {} },
          query: {},
          path: "",
          _name: "",
        },
      },
      highlight: {
        boundary_chars: {},
        boundary_max_scan: 20,
        boundary_scanner: { __one_of: ["chars", "sentence", "word"] },
        boundary_scanner_locale: {},
        encoder: { __one_of: ["default", "html"] },
        force_source: { __one_of: ["false", "true"] },
        fragmenter: { __one_of: ["simple", "span"] },
        highlight_query: { __scope_link: "GLOBAL.query" },
        matched_fields: ["FIELD"],
        order: {},
        no_match_size: 0,
        number_of_fragments: 5,
        phrase_limit: 256,
        pre_tags: {},
        post_tags: {},
        require_field_match: { __one_of: ["true", "false"] },
        tags_schema: {},
        fields: {
          "{field}": {
            fragment_size: 20,
            number_of_fragments: 5,
            boundary_chars: {},
            boundary_max_scan: 20,
            boundary_scanner: { __one_of: ["chars", "sentence", "word"] },
            boundary_scanner_locale: {},
            encoder: { __one_of: ["default", "html"] },
            force_source: { __one_of: ["false", "true"] },
            fragmenter: { __one_of: ["simple", "span"] },
            highlight_query: { __scope_link: "GLOBAL.query" },
            matched_fields: ["FIELD"],
            order: {},
            no_match_size: 0,
            phrase_limit: 256,
            pre_tags: {},
            post_tags: {},
            require_field_match: { __one_of: ["true", "false"] },
            tags_schema: {},
          },
        },
      },
      script: {
        __template: { source: "SCRIPT" },
        source: "SCRIPT",
        file: "FILE_SCRIPT_NAME",
        id: "SCRIPT_ID",
        lang: "",
        params: {},
      },
      query: {
        match: {
          __template: { FIELD: "TEXT" },
          "{field}": {
            type: { __one_of: ["phrase", "phrase_prefix", "boolean"] },
            cutoff_frequency: 0.001,
            query: "",
            operator: { __one_of: ["and", "or"] },
            zero_terms_query: { __one_of: ["none", "all"] },
            max_expansions: 10,
            analyzer: "",
            boost: 1,
            lenient: { __one_of: ["true", "false"] },
            fuzzy_transpositions: { __one_of: ["true", "false"] },
            auto_generate_synonyms_phrase_query: {
              __one_of: ["true", "false"],
            },
            fuzziness: 1,
            prefix_length: 1,
            minimum_should_match: 1,
          },
        },
        match_phrase: {
          __template: { FIELD: "PHRASE" },
          "{field}": { query: "", analyzer: "", slop: 1 },
        },
        match_phrase_prefix: {
          __template: { FIELD: "PREFIX" },
          "{field}": {
            query: "",
            analyzer: "",
            max_expansions: 10,
            prefix_length: 1,
            fuzziness: 0.1,
          },
        },
        regexp: {
          __template: { FIELD: "REGEXP" },
          "{field}": {
            value: "",
            flags: {
              __one_of: [
                "ALL",
                "ANYSTRING",
                "COMPLEMENT",
                "EMPTY",
                "INTERSECTION",
                "INTERVAL",
                "NONE",
              ],
            },
            max_determinized_states: 10000,
          },
        },
        multi_match: {
          __template: { query: "", fields: [] },
          cutoff_frequency: 0.001,
          query: "",
          operator: { __one_of: ["and", "or"] },
          zero_terms_query: { __one_of: ["none", "all"] },
          max_expansions: 10,
          analyzer: "",
          boost: 1,
          lenient: { __one_of: ["true", "false"] },
          fuzzy_transpositions: { __one_of: ["true", "false"] },
          auto_generate_synonyms_phrase_query: { __one_of: ["true", "false"] },
          fuzziness: 1,
          prefix_length: 1,
          minimum_should_match: 1,
          fields: ["{field}"],
          use_dis_max: { __template: true, __one_of: [true, false] },
          tie_breaker: 0,
          type: {
            __one_of: [
              "best_fields",
              "most_fields",
              "cross_fields",
              "phrase",
              "phrase_prefix",
            ],
          },
        },
        bool: {
          must: [{ __scope_link: "." }],
          must_not: [{ __scope_link: "." }],
          should: [{ __scope_link: "." }],
          filter: { __scope_link: "GLOBAL.filter" },
          minimum_should_match: 1,
          boost: 1,
        },
        boosting: {
          positive: { __scope_link: "." },
          negative: { __scope_link: "." },
          negative_boost: 0.2,
        },
        ids: { type: "", values: [] },
        constant_score: {
          __template: { filter: {}, boost: 1.2 },
          query: {},
          filter: {},
          boost: 1.2,
        },
        dis_max: {
          __template: { tie_breaker: 0.7, boost: 1.2, queries: [] },
          tie_breaker: 0.7,
          boost: 1.2,
          queries: [{ __scope_link: "." }],
        },
        exists: { field: "" },
        field: {
          "{field}": {
            query: "",
            boost: 2,
            enable_position_increments: {
              __template: false,
              __one_of: [true, false],
            },
          },
        },
        fuzzy: {
          __template: { FIELD: {} },
          "{field}": { value: "", boost: 1, fuzziness: 0.5, prefix_length: 0 },
        },
        has_child: {
          __template: { type: "TYPE", query: {} },
          inner_hits: {
            docvalue_fields: ["FIELD"],
            from: {},
            size: {},
            sort: {},
            name: {},
            highlight: {},
            _source: { __one_of: ["true", "false"] },
            explain: { __one_of: ["true", "false"] },
            script_fields: {
              __template: { FIELD: { script: {} } },
              "{field}": { script: {} },
            },
            version: { __one_of: ["true", "false"] },
          },
          type: "{type}",
          score_mode: { __one_of: ["none", "max", "sum", "avg"] },
          _scope: "",
          query: {},
          min_children: 1,
          max_children: 10,
        },
        has_parent: {
          __template: { parent_type: "TYPE", query: {} },
          parent_type: "{type}",
          score_mode: { __one_of: ["none", "score"] },
          _scope: "",
          query: {},
        },
        match_all: { boost: 1 },
        more_like_this: {
          __template: {
            fields: ["FIELD"],
            like: "text like this one",
            min_term_freq: 1,
            max_query_terms: 12,
          },
          fields: ["{field}"],
          like: "",
          percent_terms_to_match: 0.3,
          min_term_freq: 2,
          max_query_terms: 25,
          stop_words: [""],
          min_doc_freq: 5,
          max_doc_freq: 100,
          min_word_len: 0,
          max_word_len: 0,
          boost_terms: 1,
          boost: 1,
          analyzer: "",
          docs: [{ _index: "{index}", _type: "{type}", _id: "" }],
          ids: [""],
        },
        mlt: {
          __template: {
            fields: ["FIELD"],
            like: "text like this one",
            min_term_freq: 1,
            max_query_terms: 12,
          },
          __scope_link: ".more_like_this",
        },
        prefix: {
          __template: { FIELD: { value: "" } },
          "{field}": { value: "", boost: 1 },
        },
        query_string: {
          __template: {
            default_field: "FIELD",
            query: "this AND that OR thus",
          },
          query: "",
          default_field: "{field}",
          fields: ["{field}"],
          default_operator: { __one_of: ["OR", "AND"] },
          analyzer: "",
          allow_leading_wildcard: { __one_of: [true, false] },
          enable_position_increments: { __one_of: [true, false] },
          fuzzy_max_expansions: 50,
          fuzziness: 0.5,
          fuzzy_prefix_length: 0,
          phrase_slop: 0,
          boost: 1,
          analyze_wildcard: { __one_of: [false, true] },
          auto_generate_phrase_queries: { __one_of: [false, true] },
          minimum_should_match: "20%",
          lenient: { __one_of: [false, true] },
          use_dis_max: { __one_of: [true, false] },
          tie_breaker: 0,
          time_zone: "+1:00",
        },
        simple_query_string: {
          __template: { query: "", fields: [] },
          query: "",
          fields: ["{field}"],
          default_operator: { __one_of: ["OR", "AND"] },
          analyzer: "",
          flags: "OR|AND|PREFIX",
          locale: "ROOT",
          lenient: { __one_of: [true, false] },
        },
        range: {
          __template: { FIELD: { gte: 10, lte: 20 } },
          "{field}": {
            __template: { gte: 10, lte: 20 },
            gte: 10,
            gt: 10,
            lte: 20,
            lt: 20,
            time_zone: "+1:00",
            boost: 1,
            format: "dd/MM/yyyy||yyyy",
          },
        },
        span_first: {
          __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
          match: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
        },
        span_multi: {
          __template: { match: { MULTI_TERM_QUERY: {} } },
          match: {
            wildcard: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".wildcard",
            },
            fuzzy: { __template: { FIELD: {} }, __scope_link: ".fuzzy" },
            prefix: {
              __template: { FIELD: { value: "" } },
              __scope_link: ".prefix",
            },
            range: {
              __template: { FIELD: { gte: 10, lte: 20 } },
              __scope_link: ".range",
            },
            regexp: {
              __template: { FIELD: "REGEXP" },
              __scope_link: ".regexp",
            },
          },
        },
        span_near: {
          __template: {
            clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
            slop: 12,
            in_order: false,
          },
          clauses: [
            {
              span_first: {
                __template: {
                  match: { span_term: { FIELD: "VALUE" } },
                  end: 3,
                },
                __scope_link: ".span_first",
              },
              span_near: {
                __template: {
                  clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  slop: 12,
                  in_order: false,
                },
                __scope_link: ".span_near",
              },
              span_or: {
                __template: {
                  clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                },
                __scope_link: ".span_or",
              },
              span_not: {
                __template: {
                  include: { span_term: { FIELD: { value: "VALUE" } } },
                  exclude: { span_term: { FIELD: { value: "VALUE" } } },
                },
                __scope_link: ".span_not",
              },
              span_term: {
                __template: { FIELD: { value: "VALUE" } },
                __scope_link: ".span_term",
              },
              span_containing: {
                __template: {
                  little: { span_term: { FIELD: { value: "VALUE" } } },
                  big: {
                    span_near: {
                      clauses: [
                        { span_term: { FIELD: { value: "VALUE" } } },
                        { span_term: { FIELD: { value: "VALUE" } } },
                      ],
                      slop: 5,
                      in_order: false,
                    },
                  },
                },
                __scope_link: ".span_containing",
              },
              span_within: {
                __template: {
                  little: { span_term: { FIELD: { value: "VALUE" } } },
                  big: {
                    span_near: {
                      clauses: [
                        { span_term: { FIELD: { value: "VALUE" } } },
                        { span_term: { FIELD: { value: "VALUE" } } },
                      ],
                      slop: 5,
                      in_order: false,
                    },
                  },
                },
                __scope_link: ".span_within",
              },
              field_masking_span: {
                __template: { query: { SPAN_QUERY: {} } },
                query: {
                  span_first: {
                    __template: {
                      match: { span_term: { FIELD: "VALUE" } },
                      end: 3,
                    },
                    __scope_link: ".span_first",
                  },
                  span_near: {
                    __template: {
                      clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                      slop: 12,
                      in_order: false,
                    },
                    __scope_link: ".span_near",
                  },
                  span_or: {
                    __template: {
                      clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    },
                    __scope_link: ".span_or",
                  },
                  span_not: {
                    __template: {
                      include: { span_term: { FIELD: { value: "VALUE" } } },
                      exclude: { span_term: { FIELD: { value: "VALUE" } } },
                    },
                    __scope_link: ".span_not",
                  },
                  span_term: {
                    __template: { FIELD: { value: "VALUE" } },
                    __scope_link: ".span_term",
                  },
                  span_containing: {
                    __template: {
                      little: { span_term: { FIELD: { value: "VALUE" } } },
                      big: {
                        span_near: {
                          clauses: [
                            { span_term: { FIELD: { value: "VALUE" } } },
                            { span_term: { FIELD: { value: "VALUE" } } },
                          ],
                          slop: 5,
                          in_order: false,
                        },
                      },
                    },
                    __scope_link: ".span_containing",
                  },
                  span_within: {
                    __template: {
                      little: { span_term: { FIELD: { value: "VALUE" } } },
                      big: {
                        span_near: {
                          clauses: [
                            { span_term: { FIELD: { value: "VALUE" } } },
                            { span_term: { FIELD: { value: "VALUE" } } },
                          ],
                          slop: 5,
                          in_order: false,
                        },
                      },
                    },
                    __scope_link: ".span_within",
                  },
                },
                field: "",
              },
            },
          ],
          slop: 12,
          in_order: { __one_of: [false, true] },
          collect_payloads: { __one_of: [false, true] },
        },
        span_term: {
          __template: { FIELD: { value: "VALUE" } },
          "{field}": { value: "", boost: 2 },
        },
        span_not: {
          __template: {
            include: { span_term: { FIELD: { value: "VALUE" } } },
            exclude: { span_term: { FIELD: { value: "VALUE" } } },
          },
          include: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
          exclude: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
        },
        span_or: {
          __template: {
            clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
          },
          clauses: [
            {
              span_first: {
                __template: {
                  match: { span_term: { FIELD: "VALUE" } },
                  end: 3,
                },
                __scope_link: ".span_first",
              },
              span_near: {
                __template: {
                  clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  slop: 12,
                  in_order: false,
                },
                __scope_link: ".span_near",
              },
              span_or: {
                __template: {
                  clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                },
                __scope_link: ".span_or",
              },
              span_not: {
                __template: {
                  include: { span_term: { FIELD: { value: "VALUE" } } },
                  exclude: { span_term: { FIELD: { value: "VALUE" } } },
                },
                __scope_link: ".span_not",
              },
              span_term: {
                __template: { FIELD: { value: "VALUE" } },
                __scope_link: ".span_term",
              },
              span_containing: {
                __template: {
                  little: { span_term: { FIELD: { value: "VALUE" } } },
                  big: {
                    span_near: {
                      clauses: [
                        { span_term: { FIELD: { value: "VALUE" } } },
                        { span_term: { FIELD: { value: "VALUE" } } },
                      ],
                      slop: 5,
                      in_order: false,
                    },
                  },
                },
                __scope_link: ".span_containing",
              },
              span_within: {
                __template: {
                  little: { span_term: { FIELD: { value: "VALUE" } } },
                  big: {
                    span_near: {
                      clauses: [
                        { span_term: { FIELD: { value: "VALUE" } } },
                        { span_term: { FIELD: { value: "VALUE" } } },
                      ],
                      slop: 5,
                      in_order: false,
                    },
                  },
                },
                __scope_link: ".span_within",
              },
              field_masking_span: {
                __template: { query: { SPAN_QUERY: {} } },
                query: {
                  span_first: {
                    __template: {
                      match: { span_term: { FIELD: "VALUE" } },
                      end: 3,
                    },
                    __scope_link: ".span_first",
                  },
                  span_near: {
                    __template: {
                      clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                      slop: 12,
                      in_order: false,
                    },
                    __scope_link: ".span_near",
                  },
                  span_or: {
                    __template: {
                      clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    },
                    __scope_link: ".span_or",
                  },
                  span_not: {
                    __template: {
                      include: { span_term: { FIELD: { value: "VALUE" } } },
                      exclude: { span_term: { FIELD: { value: "VALUE" } } },
                    },
                    __scope_link: ".span_not",
                  },
                  span_term: {
                    __template: { FIELD: { value: "VALUE" } },
                    __scope_link: ".span_term",
                  },
                  span_containing: {
                    __template: {
                      little: { span_term: { FIELD: { value: "VALUE" } } },
                      big: {
                        span_near: {
                          clauses: [
                            { span_term: { FIELD: { value: "VALUE" } } },
                            { span_term: { FIELD: { value: "VALUE" } } },
                          ],
                          slop: 5,
                          in_order: false,
                        },
                      },
                    },
                    __scope_link: ".span_containing",
                  },
                  span_within: {
                    __template: {
                      little: { span_term: { FIELD: { value: "VALUE" } } },
                      big: {
                        span_near: {
                          clauses: [
                            { span_term: { FIELD: { value: "VALUE" } } },
                            { span_term: { FIELD: { value: "VALUE" } } },
                          ],
                          slop: 5,
                          in_order: false,
                        },
                      },
                    },
                    __scope_link: ".span_within",
                  },
                },
                field: "",
              },
            },
          ],
        },
        span_containing: {
          __template: {
            little: { span_term: { FIELD: { value: "VALUE" } } },
            big: {
              span_near: {
                clauses: [
                  { span_term: { FIELD: { value: "VALUE" } } },
                  { span_term: { FIELD: { value: "VALUE" } } },
                ],
                slop: 5,
                in_order: false,
              },
            },
          },
          little: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
          big: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
        },
        span_within: {
          __template: {
            little: { span_term: { FIELD: { value: "VALUE" } } },
            big: {
              span_near: {
                clauses: [
                  { span_term: { FIELD: { value: "VALUE" } } },
                  { span_term: { FIELD: { value: "VALUE" } } },
                ],
                slop: 5,
                in_order: false,
              },
            },
          },
          little: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
          big: {
            span_first: {
              __template: { match: { span_term: { FIELD: "VALUE" } }, end: 3 },
              __scope_link: ".span_first",
            },
            span_near: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                slop: 12,
                in_order: false,
              },
              __scope_link: ".span_near",
            },
            span_or: {
              __template: {
                clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
              },
              __scope_link: ".span_or",
            },
            span_not: {
              __template: {
                include: { span_term: { FIELD: { value: "VALUE" } } },
                exclude: { span_term: { FIELD: { value: "VALUE" } } },
              },
              __scope_link: ".span_not",
            },
            span_term: {
              __template: { FIELD: { value: "VALUE" } },
              __scope_link: ".span_term",
            },
            span_containing: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_containing",
            },
            span_within: {
              __template: {
                little: { span_term: { FIELD: { value: "VALUE" } } },
                big: {
                  span_near: {
                    clauses: [
                      { span_term: { FIELD: { value: "VALUE" } } },
                      { span_term: { FIELD: { value: "VALUE" } } },
                    ],
                    slop: 5,
                    in_order: false,
                  },
                },
              },
              __scope_link: ".span_within",
            },
            field_masking_span: {
              __template: { query: { SPAN_QUERY: {} } },
              query: {
                span_first: {
                  __template: {
                    match: { span_term: { FIELD: "VALUE" } },
                    end: 3,
                  },
                  __scope_link: ".span_first",
                },
                span_near: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                    slop: 12,
                    in_order: false,
                  },
                  __scope_link: ".span_near",
                },
                span_or: {
                  __template: {
                    clauses: [{ span_term: { FIELD: { value: "VALUE" } } }],
                  },
                  __scope_link: ".span_or",
                },
                span_not: {
                  __template: {
                    include: { span_term: { FIELD: { value: "VALUE" } } },
                    exclude: { span_term: { FIELD: { value: "VALUE" } } },
                  },
                  __scope_link: ".span_not",
                },
                span_term: {
                  __template: { FIELD: { value: "VALUE" } },
                  __scope_link: ".span_term",
                },
                span_containing: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_containing",
                },
                span_within: {
                  __template: {
                    little: { span_term: { FIELD: { value: "VALUE" } } },
                    big: {
                      span_near: {
                        clauses: [
                          { span_term: { FIELD: { value: "VALUE" } } },
                          { span_term: { FIELD: { value: "VALUE" } } },
                        ],
                        slop: 5,
                        in_order: false,
                      },
                    },
                  },
                  __scope_link: ".span_within",
                },
              },
              field: "",
            },
          },
        },
        term: {
          __template: { FIELD: { value: "VALUE" } },
          "{field}": { value: "", boost: 2 },
        },
        terms: { __template: { FIELD: ["VALUE1", "VALUE2"] }, "{field}": [""] },
        wildcard: {
          __template: { FIELD: { value: "VALUE" } },
          "{field}": { value: "", boost: 2 },
        },
        nested: {
          __template: { path: "path_to_nested_doc", query: {} },
          inner_hits: {
            docvalue_fields: ["FIELD"],
            from: {},
            size: {},
            sort: {},
            name: {},
            highlight: {},
            _source: { __one_of: ["true", "false"] },
            explain: { __one_of: ["true", "false"] },
            script_fields: {
              __template: { FIELD: { script: {} } },
              "{field}": { script: {} },
            },
            version: { __one_of: ["true", "false"] },
          },
          path: "",
          query: {},
          score_mode: { __one_of: ["avg", "total", "max", "none"] },
        },
        percolate: {
          __template: { field: "", document: {} },
          field: "",
          document: {},
          name: "",
          documents: [{}],
          document_type: "",
          index: "",
          type: "",
          id: "",
          routing: "",
          preference: "",
        },
        common: {
          __template: { FIELD: { query: {} } },
          "{field}": {
            query: {},
            cutoff_frequency: 0.001,
            minimum_should_match: { low_freq: {}, high_freq: {} },
          },
        },
        custom_filters_score: {
          __template: { query: {}, filters: [{ filter: {} }] },
          query: {},
          filters: [{ filter: {}, boost: 2, script: {} }],
          score_mode: {
            __one_of: ["first", "min", "max", "total", "avg", "multiply"],
          },
          max_boost: 2,
          params: {},
          lang: "",
        },
        indices: {
          __template: { indices: ["INDEX1", "INDEX2"], query: {} },
          indices: ["{index}"],
          query: {},
          no_match_query: { __scope_link: "." },
        },
        geo_shape: {
          __template: { location: {}, relation: "within" },
          __scope_link: ".filter.geo_shape",
        },
        function_score: {
          __template: { query: {}, functions: [{}] },
          query: {},
          functions: [
            {
              filter: {},
              weight: 1,
              script_score: {
                __template: { script: "_score * doc['f'].value" },
                script: {},
              },
              boost_factor: 2,
              random_score: { seed: 314159265359 },
              linear: {
                __template: { FIELD: { origin: "", scale: "" } },
                "{field}": { origin: "", scale: "", offset: "", decay: 0.5 },
              },
              exp: {
                __template: { FIELD: { origin: "", scale: "" } },
                "{field}": { origin: "", scale: "", offset: "", decay: 0.5 },
              },
              gauss: {
                __template: { FIELD: { origin: "", scale: "" } },
                "{field}": { origin: "", scale: "", offset: "", decay: 0.5 },
              },
              field_value_factor: {
                __template: { field: "" },
                field: "{field}",
                factor: 1.2,
                modifier: {
                  __one_of: [
                    "none",
                    "log",
                    "log1p",
                    "log2p",
                    "ln",
                    "ln1p",
                    "ln2p",
                    "square",
                    "sqrt",
                    "reciprocal",
                  ],
                },
              },
            },
          ],
          boost: 1,
          boost_mode: {
            __one_of: ["multiply", "replace", "sum", "avg", "max", "min"],
          },
          score_mode: {
            __one_of: ["multiply", "sum", "first", "avg", "max", "min"],
          },
          max_boost: 10,
          min_score: 1,
          script_score: {
            __template: { script: "_score * doc['f'].value" },
            script: {},
          },
          boost_factor: 2,
          random_score: { seed: 314159265359 },
          linear: {
            __template: { FIELD: { origin: "", scale: "" } },
            "{field}": { origin: "", scale: "", offset: "", decay: 0.5 },
          },
          exp: {
            __template: { FIELD: { origin: "", scale: "" } },
            "{field}": { origin: "", scale: "", offset: "", decay: 0.5 },
          },
          gauss: {
            __template: { FIELD: { origin: "", scale: "" } },
            "{field}": { origin: "", scale: "", offset: "", decay: 0.5 },
          },
          field_value_factor: {
            __template: { field: "" },
            field: "{field}",
            factor: 1.2,
            modifier: {
              __one_of: [
                "none",
                "log",
                "log1p",
                "log2p",
                "ln",
                "ln1p",
                "ln2p",
                "square",
                "sqrt",
                "reciprocal",
              ],
            },
          },
        },
        script: {
          __template: { script: "_score * doc['f'].value" },
          script: {},
        },
        wrapper: { __template: { query: "QUERY_BASE64_ENCODED" }, query: "" },
      },
    },
    endpoints: {
      "cluster.allocation_explain": {
        url_params: {
          include_yes_decisions: "__flag__",
          include_disk_info: "__flag__",
        },
        methods: ["GET", "POST"],
        patterns: ["_cluster/allocation/explain"],
        documentation:
          "http://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-allocation-explain.html",
        id: "cluster.allocation_explain",
      },
      "cluster.reroute": {
        url_params: {
          dry_run: "__flag__",
          explain: "__flag__",
          retry_failed: "__flag__",
          metric: [],
          master_timeout: "",
          timeout: "",
        },
        methods: ["POST"],
        patterns: ["_cluster/reroute"],
        documentation:
          "http://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-reroute.html",
        data_autocomplete_rules: {
          commands: [
            {
              move: {
                __template: { index: "", shard: 0, from_node: "", to_node: "" },
                index: "{index}",
                shard: 0,
                from_node: "{node}",
                to_node: "{node}",
              },
              cancel: {
                __template: { index: "", shard: 0, node: "" },
                index: "{index}",
                shard: 0,
                node: "{node}",
                allow_primary: { __one_of: [true, false] },
              },
              allocate: {
                __template: { index: "", shard: 0, node: "" },
                index: "{index}",
                shard: 0,
                node: "{node}",
                allow_primary: { __one_of: [true, false] },
              },
            },
          ],
          dry_run: { __one_of: [true, false] },
        },
        id: "cluster.reroute",
      },
    },
  },
};
